import config from "./config.js";
import apiClient from "./apiClient.js";

const exports = {};

exports.init = function() {
    const navAnchors = document.body.querySelectorAll("#navContent a");
    const resultsP = document.querySelector("#resultsP");

    navAnchors.forEach((anchor) => {
        exports.addClick(anchor.id, exports.handleClick);
    });

    resultsP.innerHTML = "Initialized";
    console.log("Initialized");
};

exports.handleClick = function(event) {
    console.log(event);
    console.log(event.target.id);
    const apiUrl = [
        config.api.baseUrl, config.api.endpoint[event.target.id]
        ].join("/");
    resultsP.innerHTML = "Loading data from " + apiUrl;
    apiClient.fetchData(apiUrl).then((res) => {
        const resultsJson = JSON.stringify(res);
        resultsP.innerHTML = resultsJson;
    }, (err) => {
        console.error(err);
    });
};

exports.addClick = function(anchorId, handler) {
    const anchor = document.body.querySelector("#" + anchorId);
    anchor.onclick = handler;
}

export default exports;