import config from "./config.js";

import apiClient from "./apiClient.js";
import itemCard from "./itemCard.js";

import Lab from "./lab.js";

const exports = {};


exports.init = function() {
    const navAnchors = document.body.querySelectorAll("#navContent a");
    const loadingDiv = document.body.querySelectorAll("loadingDiv");
    const resultsDiv = document.body.querySelector("#resultsDiv");

    navAnchors.forEach((anchor) => {
        exports.addClick(anchor.id, exports.handleClick);
    });
    // exports.addClick("fetchLanguagesLink", apiClient.fetchLanguages);
/*
    ReactDOM.render(
        React.createElement(Lab), resultsDiv
    );
    */
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

exports.resultsCards = function(type, results) {
    results.forEach(
        (item) => resultsDiv.appendChild(itemCard.resultsCard[type](item))
    );
};

exports.handleClick = function(event) {
    event.preventDefault();
    console.log(event);

    const props = {"clickId": config.api.endpoint[event.target.id]};
    ReactDOM.render(
        React.createElement(Lab, props), resultsDiv
    );

};

exports.handleClickOld = function(event) {
    event.preventDefault();
    const apiUrl = [
        config.api.baseUrl, config.api.endpoint[event.target.id]
        ].join("/");

    exports.showLoading();
    apiClient.fetchData(apiUrl).then((res) => {
        console.log("results", res.results);
        resultsDiv.innerHTML = "";
        exports.resultsCards("media", res.results);
        exports.hideLoading();
    }, (err) => {
        console.error(err);
    });
};

exports.addClick = function(anchorId, handler) {
    console.log("addClick", anchorId);
    const anchor = document.body.querySelector("#" + anchorId);
    anchor.onclick = handler;
}

export default exports;
