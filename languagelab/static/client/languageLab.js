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

    ReactDOM.render(
        React.createElement(Lab), resultsDiv
    );
};

exports.handleClick = function(event) {
    event.preventDefault();
    const props = {"clickId": config.api.endpoint[event.target.id]};
    ReactDOM.render(
        React.createElement(Lab, props), resultsDiv
    );

};

exports.addClick = function(anchorId, handler) {
    const anchor = document.body.querySelector("#" + anchorId);
    anchor.onclick = handler;
}

export default exports;
