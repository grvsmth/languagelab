/*

*/

export default class LanguageLabClient {

    constructor(props) {
        this.token = "";
    }

    setToken(token) {
        this.token = token;
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
        if (!this.token) {
            return null;
        }

        return new Promise((resolve, reject) => {
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
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    updateLanguages(baseUrl) {
        const csrftoken = this.extractCookie("csrftoken");
        const apiUrl = [baseUrl, "languages", "updateAll", ""].join("/");
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
}
