/*
    Client for the customized LanguageLab API
*/

export default class LanguageLabClient {

    constructor(props) {
        this.expiredError = "Expired token!";

        this.token = "";
        this.tokenTime = null;
        this.baseUrl = "";
    }

    setToken(token, tokenTime, tokenLife) {
        this.token = token;
        this.tokenTime = new moment(tokenTime);
        this.tokenLife = tokenLife;
    }

    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }

    tokenExpired() {
        const now = new moment().format();
        const difference = new moment().diff(this.tokenTime, "seconds");
        console.log(
            `${now} - ${this.tokenTime.format()} = ${difference} ? ${this.tokenLife}`
        );
        if (this.tokenLife - difference > 10) {
            return false;
        }
        return true;
    }

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

    fetchData(url, options={}, results=[]) {
        return new Promise((resolve, reject) => {
            if (!this.token) {
                reject("No token in API client object!");
            }

            if (!options.hasOwnProperty("headers")) {
                options.headers = {};
            }
            options.headers.Authorization = "JWT " + this.token;

            try{
                this.checkToken();
            } catch (error) {
                if (error.message === this.expiredError) {
                    console.log("Expired token in fetchData!");
                    this.refreshToken().then(() => {
                        this.fetchData(url, options, results).then(
                        resolve, reject
                        );
                    });
                } else {
                    throw new Error(error);
                }
            }
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
            }, (err) => {
                reject({"type": endpoint, "error": err});
            });
        });
    }

    delete(baseUrl, endpoint, id) {
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [baseUrl, endpoint, id, ""].join("/");
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
            }, (err) => {
                reject({"type": endpoint, "error": err});
            });
        });
    }

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
            }, (err) => {
                reject({"type": endpoint, "error": err});
            });
        });
    }

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

        return new Promise((resolve, reject) => {
            this.fetchData(apiUrl, options).then((res) => {
                resolve({"type": "token-auth", "response": res});
            }, (err) => {
                reject({"type": endpoint, "error": err});
            });
        });
    }

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
                    reject({"type": "token-auth", "error": err});
                });
            }, (err) => {
                reject({"type": "token-auth", "error": err});
            });
        });
    }

    checkToken() {
        if (this.tokenExpired()) {
            throw new Error("Expired token!");
        }
        return;
    }
}
