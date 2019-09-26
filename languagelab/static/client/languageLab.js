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


exports.cardLink = function(linkText, classList=[]) {
    const linkDiv = document.createElement("a");
    linkDiv.classList.add("card-link", ...classList);
    linkDiv.appendChild(document.createTextNode(linkText));
    return linkDiv;
};

exports.checkClick = function(event) {
    event.preventDefault();
    console.dir(event.target);
    const payload = {[event.target.value]: event.target.checked};

    const idPart = event.target.id.split(".");
    apiClient.patch(payload, idPart[0], idPart[2]).then((res) => {
        console.log(res);
    }, (err) => {
        console.error(err);
    });
};

exports.makeCheckbox = function(endpoint, value, labelText, itemId, checked) {
    const itemCheckboxes = document.createElement("div");
    itemCheckboxes.classList.add("form-check", "form-check-inline");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input");
    checkbox.id = [endpoint, value, itemId].join(".");
    checkbox.value = value;
    checkbox.checked = checked;
    checkbox.addEventListener("click", exports.checkClick);
    itemCheckboxes.appendChild(checkbox);

    const labelElement = document.createElement("label");
    labelElement.for = checkbox.id;
    labelElement.classList.add("form-check-label");
    labelElement.appendChild(document.createTextNode(labelText));
    itemCheckboxes.appendChild(labelElement);

    return itemCheckboxes;
};

exports.resultsCard = function(type, item) {
    const uploaded = new moment(item.uploaded).format(config.dateTimeFormat);

    const itemCard = document.createElement("div");
    itemCard.classList.add("card", "bg-light");
    itemCard.id = [type, item.id].join(".");

    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body");

    const itemTitle = document.createElement("h5");
    itemTitle.classList.add("card-title");

    const formatText = config.formatName[item.format];

    const nameText = `${item.name} (${formatText}, ${item.duration})`;
    itemTitle.appendChild(document.createTextNode(nameText));
    cardBody.appendChild(itemTitle);

    const itemSubtitle = document.createElement("h6");
    itemSubtitle.classList.add("card-subtitle", "text-muted");
    const subtitleText = `${item.creator} (added ${uploaded})`;
    itemSubtitle.appendChild(document.createTextNode(subtitleText));
    cardBody.appendChild(itemSubtitle);

    // TODO tags

    const rightsSpan = document.createElement("span");
    rightsSpan.classList.add("card-text", "mr-2");
    rightsSpan.appendChild(document.createTextNode(item.rights));
    cardBody.appendChild(rightsSpan);

    cardBody.appendChild(
        exports.makeCheckbox(
            "media", "isAvailable", "available", item.id, item.isAvailable
        )
    );

    cardBody.appendChild(
        exports.makeCheckbox(
            "media", "isPublic", "public", item.id, item.isPublic
            )
    );

    const linkDiv = document.createElement("div");
    linkDiv.appendChild(exports.cardLink("edit", ["text-primary"]));
    linkDiv.appendChild(exports.cardLink("delete", ["text-danger"]));
    cardBody.appendChild(linkDiv);

    itemCard.appendChild(cardBody);

    return itemCard;
}

exports.resultsCards = function(type, results) {
    results.forEach(
        (item) => resultsDiv.appendChild(exports.resultsCard(type, item))
    );
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
        exports.resultsCards("media", res.results);
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