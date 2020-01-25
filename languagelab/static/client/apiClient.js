const exports = {};

exports.extractCookie = function(cookieKey) {
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
};

exports.fetchData = function(url, options={}, results=[]) {
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
};

exports.updateLanguages = function(baseUrl) {
    const csrftoken = exports.extractCookie("csrftoken");
    const apiUrl = [baseUrl, "languages", "updateAll", ""].join("/");
    const options = {
        "method": "POST",
        "mode": "cors",
        "headers": {"X-CSRFToken": csrftoken}
    };

    exports.fetchData(apiUrl, options).then((res) => {
        console.log(res);
    }, (err) => {
        console.error(err);
    });
};

exports.post = function(baseUrl, endpoint, data) {
    const csrftoken = exports.extractCookie("csrftoken");
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
        exports.fetchData(apiUrl, options).then((res) => {
            resolve({"type": endpoint, "response": res});
        }, (err) => {
            reject({"type": endpoint, "error": err});
        });
    });
};

exports.patch = function(baseUrl, endpoint, data, id=null) {
    const csrftoken = exports.extractCookie("csrftoken");
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
        exports.fetchData(apiUrl, options).then((res) => {
            resolve({"type": endpoint, "response": res});
        }, (err) => {
            reject({"type": endpoint, "error": err});
        });
    });
};

exports.delete = function(baseUrl, endpoint, id) {
    const csrftoken = exports.extractCookie("csrftoken");
    const apiUrl = [baseUrl, endpoint, id, ""].join("/");
    const options = {
        "method": "DELETE",
        "headers": {
            "X-CSRFToken": csrftoken,
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        exports.fetchData(apiUrl, options).then((res) => {
            resolve({"type": endpoint, "response": res});
        }, (err) => {
            reject({"type": endpoint, "error": err});
        });
    });
};

exports.post = function(baseUrl, endpoint, data) {
    const csrftoken = exports.extractCookie("csrftoken");
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
        exports.fetchData(apiUrl, options).then((res) => {
            resolve({"type": endpoint, "response": res});
        }, (err) => {
            reject({"type": endpoint, "error": err});
        });
    });
};

export default exports;
