/*
    Client for the customized LanguageLab API
*/

const refreshThreshold = 60;

export default class LanguageLabClient {

    /*

        Define the class attributes

    */
    constructor() {
        this.handleToken;
        this.expiredError = "Expired token!";

        this.token = "";
        this.tokenLife = 0;
        this.tokenTime = null;
        this.baseUrl = "";
    }

    /*

        Set the token, the time when the token was refreshed, and the token life

    */
    setToken(token, tokenTime, tokenLife=this.tokenLife) {
        this.token = token;
        this.tokenTime = new moment(tokenTime);
        this.tokenLife = tokenLife;
    }

    /*

        Set the method to handle a new token

    */
    setHandleToken(handler) {
        this.handleToken = handler;
    }

    /*

        Set the base URL for connecting to the API

    */
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /*

        Throw an error if we've passed the time when the token was due to expire

    */
    checkToken() {
        const now = new moment().format();
        const difference = new moment().diff(this.tokenTime, "seconds");
        if (this.tokenLife <= difference) {
            throw new Error(this.expiredError);
        }

        if (this.tokenLife - difference < refreshThreshold) {
            this.refreshToken();
        }
    }

    /*

        Given a web cookie, parse it and extract the value specified by the
        cookieKey parameter

    */
    extractCookie(cookieKey) {
        var cookieValue;
        if (!document.cookie || document.cookie == '') {
            return;
        }
        document.cookie.split(';').forEach((cookie) => {
            let cookiePiece = cookie.split("=");
            if (cookiePiece[0].trim() === cookieKey) {
                cookieValue = cookiePiece[1];
            }
        });
        return cookieValue;
    }

    /*

        Fetch data from the API, passing in options and handling pagination
        and expired tokens

    */
    fetchData(url, options={}, results=[]) {
        return new Promise((resolve, reject) => {
            if (!this.token) {
                reject("No token in API client object!");
            }

            if (!options.hasOwnProperty("headers")) {
                options.headers = {};
            }
            options.headers.Authorization = "JWT " + this.token;

            this.checkToken();
            fetch(url, options).then((res) => {
                if (res.status === 204) {
                    resolve();
                    return;
                } else if (res.status < 200 || res.status > 299) {
                    reject(res);
                    return;
                }

                res.json().then((resJson) => {
                    if (!resJson.hasOwnProperty("results")) {
                        resolve(resJson);
                    }

                    results = results.concat(resJson.results);
                    if (resJson.next) {
                        this.fetchData(resJson.next, options, results).then(
                            resolve, reject
                        );
                    } else {
                       resolve(results);
                    }
                }, reject);
            }, reject);
        });
    }

    /*

        Retrieve the list of languages (not finished)

    */
    updateLanguages(baseUrl) {
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [baseUrl, "languages", "update_all", ""].join("/");
        const options = {
            "method": "POST",
            "mode": "cors",
            "headers": {"X-CSRFToken": csrftoken}
        };

        this.fetchData(apiUrl, options).then((res) => {
            console.log(res);
        }, (err) => {
            console.error(err);
        });
    }

    /*

        Convert the data to a JSON and assemble the headers and options for a
        PATCH request

    */
    patch(baseUrl, endpoint, data, id=null) {
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [baseUrl, endpoint, id, ""].join("/");
        const options = {
            "method": "PATCH",
            "headers": {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(data)
        };

        return new Promise((resolve, reject) => {
            this.fetchData(apiUrl, options).then((res) => {
                resolve({"type": endpoint, "response": res});
            }, reject);
        });
    }

    /*

        Assemble the headers and options for a DELETE request with a given
        endpoint and ID

    */
    delete(baseUrl, endpoint, id) {
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [baseUrl, endpoint, id].join("/");
        const options = {
            "method": "DELETE",
            "headers": {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            }
        };

        return new Promise((resolve, reject) => {
            this.fetchData(apiUrl, options).then((res) => {
                resolve({"type": endpoint, "response": res});
            }, reject);
        });
    }

    /*

        Convert the data to a JSON and assemble the headers and options for a
        POST request

    */
    post(baseUrl, endpoint, data) {
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [baseUrl, endpoint, ""].join("/");
        const options = {
            "method": "POST",
            "headers": {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(data)
        };

        return new Promise((resolve, reject) => {
            this.fetchData(apiUrl, options).then((res) => {
                resolve({"type": endpoint, "response": res});
            }, reject);
        });
    }

    /*

        Request a new refresh token

    */
    refreshToken() {
        const endpoint = "token-refresh";
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [this.baseUrl, endpoint, ""].join("/");
        const options = {
            "method": "POST",
            "headers": {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify({"token": this.token})
        };

        fetch(apiUrl, options).then((res) => {
            if (res.status < 200 || res.status > 299) {
                throw new Error("Error refreshing token!");
            }

            res.json().then((resJson) => {
                this.handleToken(
                    {"type": "token-auth", "response": resJson}
                );
            }, (err) => {
                console.log(res);
                throw new Error("Error reading token JSON!");
            });
        });
    }

    /*

        Assemble and send a login request to the API

    */
    login(data) {
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [this.baseUrl, "token-auth", ""].join("/");
        const options = {
            "method": "POST",
            "headers": {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(data)
        };

        return new Promise((resolve, reject) => {
            fetch(apiUrl, options).then((res) => {
                if (res.status < 200 || res.status > 299) {
                    reject(res);
                    return;
                }

                res.json().then((resJson) => {
                    resolve({"type": "token-auth", "response": resJson});
                }, (err) => {
                    reject("Error getting token: " + err);
                });
            }, (err) => {
                reject("Error getting token: " + err);
            });
        });
    }
}
