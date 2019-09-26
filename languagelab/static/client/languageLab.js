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

exports.cardLink = function(linkText, classList=[]) {
    const linkDiv = document.createElement("a");
    linkDiv.classList.add("card-link", ...classList);
    linkDiv.appendChild(document.createTextNode(linkText));
    return linkDiv;
};

exports.resultsCards = function(results) {
    results.forEach((item, index) => {
        const uploaded = new moment(item.uploaded).format(config.dateTimeFormat);

        const itemCard = document.createElement("div");
        itemCard.classList.add("card", "bg-light");
        const cardBody = document.createElement("div")
        cardBody.classList.add("card-body");

        const itemTitle = document.createElement("h5");
        itemTitle.classList.add("card-title");
        itemTitle.appendChild(document.createTextNode(item.name));
        cardBody.appendChild(itemTitle);

        const itemSubtitle = document.createElement("h6");
        itemSubtitle.classList.add("card-subtitle", "text-muted");
        const subtitleText = `${item.creator} (added ${uploaded})`;
        itemSubtitle.appendChild(document.createTextNode(subtitleText));
        cardBody.appendChild(itemSubtitle);

        const itemCheckboxes = document.createElement("div");
        itemCheckboxes.classList.add("form-check", "form-check-inline");

        const availableCheckbox = document.createElement("input");
        availableCheckbox.type = "checkbox";
        availableCheckbox.classList.add("form-check-input");
        availableCheckbox.id = `isAvailable.${index}`;
        availableCheckbox.value = "isAvailable";
        availableCheckbox.checked = item.isAvailable == true;
        itemCheckboxes.appendChild(availableCheckbox);

        const availableLabel = document.createElement("label");
        availableLabel.for = availableCheckbox.id;
        availableLabel.classList.add("form-check-label");
        availableLabel.appendChild(document.createTextNode("available"));
        itemCheckboxes.appendChild(availableLabel);

        cardBody.appendChild(itemCheckboxes);

        const linkDiv = document.createElement("div");
        linkDiv.appendChild(exports.cardLink("edit", ["text-primary"]));
        linkDiv.appendChild(exports.cardLink("delete", ["text-danger"]));
        cardBody.appendChild(linkDiv);

        itemCard.appendChild(cardBody);

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
        console.log("results", res.results);
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