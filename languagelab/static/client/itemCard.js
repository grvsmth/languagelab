import config from "./config.js";
import apiClient from "./apiClient.js";

const exports = {};


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

    const idPart = event.target.id.split("_");
    apiClient.patch(payload, idPart[0], idPart[2]).then((res) => {
        console.log(res.type, res.response);
        const mediaCard = document.body.querySelector(`#${res.type}_${res.response.id}`);
        const newCard = exports.resultsCard(res.type, res.response);
        mediaCard.parentNode.replaceChild(newCard, mediaCard);
    }, (err) => {
        console.error(err.type, err.error);
    });
};

exports.makeCheckbox = function(endpoint, value, labelText, itemId, checked) {
    const itemCheckboxes = document.createElement("div");
    itemCheckboxes.classList.add("form-check", "form-check-inline");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input");
    checkbox.id = [endpoint, value, itemId].join("_");
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
    itemCard.id = [type, item.id].join("_");

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

export default exports;
