import config from "./config.js";
import apiClient from "./apiClient.js";

const exports = {};

exports.init = function() {
    const navAnchors = document.body.querySelectorAll("#navContent a");
    const loadingDiv = document.body.querySelectorAll("loadingDiv");
    const resultsDiv = document.body.querySelector("#resultsDiv");

    navAnchors.forEach((anchor) => {
        exports.addClick(anchor.id, exports.handleClick);
    });

};

exports.showLoading = function() {
    loadingDiv.querySelector("span").innerHTML = "Loading...";
    loadingDiv.classList.add("spinner-border");
    loadingDiv.classList.remove("hidden");
};

exports.hideLoading = function() {
    loadingDiv.querySelector("span").innerHTML = "";
    loadingDiv.classList.remove("spinner-border");
    loadingDiv.classList.add("hidden");
};

exports.handleClick = function(event) {
    const apiUrl = [
        config.api.baseUrl, config.api.endpoint[event.target.id]
        ].join("/");

    exports.showLoading();
    apiClient.fetchData(apiUrl).then((res) => {
        const resultsJson = JSON.stringify(res);
        resultsDiv.innerHTML = resultsJson;
        exports.hideLoading();
    }, (err) => {
        console.error(err);
    });
};

exports.addClick = function(anchorId, handler) {
    const anchor = document.body.querySelector("#" + anchorId);
    anchor.onclick = handler;
}

export default exports;