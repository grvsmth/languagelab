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
    // exports.addClick("fetchLanguagesLink", apiClient.fetchLanguages);

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

exports.appendCol = function(parentElement, data) {
    const colDiv = document.createElement("div");
    colDiv.classList.add("col-sm");
    colDiv.innerHTML = data;
    parentElement.appendChild(colDiv);
};

exports.headerRow = function(item) {
    const itemDiv = document.createElement("div");
    Object.keys(item).forEach((columnName) => {
        exports.appendCol(itemDiv, columnName);
    });
    itemDiv.classList.add("row");
    console.log("itemDiv", itemDiv);
    return itemDiv;
};

exports.resultsRows = function(results) {
    resultsDiv.appendChild(exports.headerRow(results[0]));
    results.forEach((item) => {
        const itemDiv = document.createElement("div");
        Object.values(item).forEach((cellContents) => {
            exports.appendCol(itemDiv, cellContents);
        });
        itemDiv.classList.add("row");
        resultsDiv.appendChild(itemDiv);
    });
};

exports.resultsCards = function(results) {
    results.forEach((item) => {
        const uploaded = new moment(item.uploaded).format(config.dateTimeFormat);

        const itemCard = document.createElement("div");
        itemCard.classList.add("card");
        const cardBody = document.createElement("div")
        cardBody.classList.add("card-body");
        itemCard.appendChild(cardBody);

        const itemTitle = document.createElement("h5");
        itemTitle.classList.add("card-title");
        itemTitle.innerHTML = item.name;
        itemCard.appendChild(itemTitle);

        const itemSubtitle = document.createElement("h6");
        itemSubtitle.classList.add("card-subtitle", "text-muted");
        itemSubtitle.innerHTML = `${item.creator} (uploaded ${uploaded})`;
        itemCard.appendChild(itemSubtitle);

        // const item

        resultsDiv.appendChild(itemCard);
    });
};

exports.handleClick = function(event) {
    event.preventDefault();
    const apiUrl = [
        config.api.baseUrl, config.api.endpoint[event.target.id]
        ].join("/");

    exports.showLoading();
    apiClient.fetchData(apiUrl).then((res) => {
        resultsDiv.innerHTML = "";
        exports.resultsCards(res.results);
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