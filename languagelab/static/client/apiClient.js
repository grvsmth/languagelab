import config from "./config.js";

const exports = {};

exports.fetchData = function(url, options={}) {
    return new Promise((resolve, reject) => {
        fetch(url, options).then((res) => {
            resolve(res.json());
        }, (err) => {
            reject(err);
        });
    });
};

exports.fetchLanguages = function() {
    const apiUrl = [config.api.baseUrl, "languages", "updateAll/"].join("/");

    console.log("apiUrl", apiUrl);
    exports.fetchData(apiUrl, {"method": "POST", "mode": "no-cors"}).then((res) => {
        console.log(res);
    }, (err) => {
        console.error(err);
    });
};

export default exports;