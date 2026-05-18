/**
 * Client for the customized LanguageLab API
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

    global moment

*/
const DEFAULT_REFRESH_THRESHOLD = 300;

/** Client class for the Language Lab API */
export default class LanguageLabClient {

    /** Define the class attributes */
    constructor() {
        this.handleToken;
        this.expiredError = "Login expired!";

        this.token = "";
        this.tokenLife = 0;
        this.tokenTime = null;
        this.baseUrl = "";
        this.refreshThreshold = DEFAULT_REFRESH_THRESHOLD;
    }

    /**
     * Set the token, the time when the token was refreshed, and the token life
     *
     * @param {string} token - the token string
     * @param {string} tokenTime - the time when the token was issued
     */
    setToken(token, tokenTime) {
        this.token = token;
        this.tokenTime = new moment(tokenTime);
    }

    /** Indicate whether we have a token string */
    hasToken() {
        return (
            typeof this.token === "object" && "access" in this.token
            && this.token.access.length > 0);
    }

    /**
     * Set the refresh threshold
     *
     * @param {number} refreshThreshold
     */
    setRefreshThreshold(refreshThreshold) {
        this.refreshThreshold = refreshThreshold;
    }

    /**
     * Set the method to handle a new token
     *
     * @param {function} handler - the token handler of the calling script
     */
    setHandleToken(handler) {
        this.handleToken = handler;
    }

    /**
     * Set the base URL for connecting to the API
     *
     * @param {string} baseUrl
     */
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Throw an error if we've passed the time when the token was due to expire,
     * or send a refresh request if we've passed the refresh threshold
     */
    checkToken() {
        const difference = new moment().diff(this.tokenTime, "seconds");

        if (difference >= this.refreshThreshold) {
            this.refreshToken();
        }
    }

    /**
     * Given a web cookie, parse it and extract the value specified by the
     * cookieKey parameter
     *
     * @param {string} cookieKey - the key of the value we're interested in
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

    /**
     * Fetch data from the API, passing in options and handling pagination
     * and expired tokens
     *
     * @param {string} url - the url to fetch
     * @param {object} options - options to pass to the fetch API
     * @param {array} results - array to append a new page of results to
     */
    fetchData(url, options={}, results=[]) {
        return new Promise((resolve, reject) => {
            if (!this.token) {
                reject("No token in API client object");
            }

            if (!Object.prototype.hasOwnProperty.call(options, "headers")) {
                options.headers = {};
            }

            this.checkToken();
            options.headers.Authorization = "Bearer " + this.token.access;

            fetch(url, options).then((res) => {
                if (res.status === 204) {
                    resolve(res);
                    return;
                } else if (res.status < 200 || res.status > 299) {
                    reject(res);
                    return;
                }

                res.json().then((resJson) => {
                    if (!Object.prototype.hasOwnProperty.call(
                        resJson,
                        "results"
                        )
                    ) {
                        resolve(resJson);
                        return;
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

    /**
     * Convert the data to a JSON and assemble the headers and options for a
     * PATCH request
     *
     * @param {string} baseUrl - the base URL of the API
     * @param {string} endpoint - the specific endpoint to access
     * @param {object} data - the data to send to the API
     * @param {number} id - the ID of the item to be updated
     */
    patch(baseUrl, endpoint, data, id=null) {
        const apiUrl = [baseUrl, endpoint, id, ""].join("/");
        const options = {
            "method": "PATCH",
            "headers": {
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

    /**
     * Assemble the headers and options for a DELETE request with a given
     * endpoint and ID
     *
     * @param {string} baseUrl - the base URL of the API
     * @param {string} endpoint - the specific endpoint to access
     * @param {number} id - the ID of the item to be updated
     */
    delete(baseUrl, endpoint, id) {
        const apiUrl = [baseUrl, endpoint, id].join("/");
        const options = {
            "method": "DELETE",
            "headers": {
                'Content-Type': 'application/json'
            }
        };

        return new Promise((resolve, reject) => {
            this.fetchData(apiUrl, options).then((res) => {
                resolve(res);
            }, reject);
        });
    }

    /**
     * Convert the data to a JSON and assemble the headers and options for a
     * POST request
     *
     * @param {string} baseUrl - the base URL of the API
     * @param {string} endpoint - the specific endpoint to access
     * @param {object} data - the data to send to the API
     */
    post(baseUrl, endpoint, data) {
        const apiUrl = [baseUrl, endpoint, ""].join("/");
        const options = {
            "method": "POST",
            "headers": {
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

    /** Request a new token */
    refreshToken() {
        if (typeof this.token !== "object" || !("refresh" in this.token)) {
            throw new Error("No refresh token");
        }

        const endpoint = "token/refresh";
        const apiUrl = [this.baseUrl, endpoint, ""].join("/");
        const options = {
            "method": "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token.refresh
            }
        };

        fetch(apiUrl, options).then((res) => {
            if (res.status < 200 || res.status > 299) {
                throw new Error(
                    "Error refreshing token: " + res.statusText
                );
            }

            res.json().then((resJson) => {
                this.handleToken(resJson);
            }, (err) => {
                console.log(err);
                throw new Error("Error reading token JSON");
            });
        });
    }

    /**
     * Assemble and send a login request to the API
     *
     * @param {object} data - the login data
     */
    login(data) {
        const apiUrl = [this.baseUrl, "token", ""].join("/");
        const options = {
            "method": "POST",
            "headers": {
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

                res.json().then(resolve, reject);
            }, reject);
        });
    }
}
