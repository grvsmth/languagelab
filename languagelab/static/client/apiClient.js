import config from "./config.js";

const exports = {};

exports.extractCookie = function(cookieKey) {
    var cookieValue;
    if (!document.cookie || document.cookie == '') {
        return;
    }
    document.cookie.split(';').forEach((cookie) => {
        let cookiePiece = cookie.split("=");
        console.log("cookiePiece = ", cookiePiece)
        if (cookiePiece[0].trim() === cookieKey) {
            console.log("returning ", cookiePiece[1]);
            cookieValue = cookiePiece[1];
        }
    });
    console.log("cookieValue = ", cookieValue);
    return cookieValue;
};

exports.fetchData = function(url, options={}) {
    return new Promise((resolve, reject) => {
       fetch(url, options).then((res) => {
            resolve(res.json());
        }, (err) => {
            reject(err);
        });
    });
}

exports.updateLanguages = function() {
    const csrftoken = exports.extractCookie("csrftoken");
    const apiUrl = [config.api.baseUrl, "languages", "updateAll/"].join("/");
    const options = {
        "method": "POST", "mode": "cors",
        "headers": {"X-CSRFToken": csrftoken}
    };

    exports.fetchData(apiUrl, options).then((res) => {
        console.log(res);
    }, (err) => {
        console.error(err);
    });
}

export default exports;
