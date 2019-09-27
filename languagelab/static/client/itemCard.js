import config from "./config.js";
import apiClient from "./apiClient.js";

const exports = {"resultsCard": {}};


exports.cardLink = function(itemType, itemId, text, classList=[], handler=null) {
    const linkDiv = document.createElement("a");
    const idText = encodeURIComponent(text);
    linkDiv.id = [itemType, idText, itemId].join("_");
    linkDiv.classList.add("card-link", ...classList);
    linkDiv.appendChild(document.createTextNode(text));
    if (handler) {
        linkDiv.addEventListener("click", handler);
    }
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
        const newCard = exports.resultsCard[res.type](res.response);
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

exports.rightsSpan = function(rightsText) {
    const rightsSpan = document.createElement("span");
    rightsSpan.classList.add("card-text", "mr-2");
    rightsSpan.appendChild(document.createTextNode(rightsText));
    return rightsSpan;
}

exports.editClick = function(event) {
    console.log("editClick()", event.target.id);

};

exports.deleteClick = function(event) {
    console.log(`deleteClick(${event.target.id})`);
};

exports.linkDiv = function(itemType, itemId) {
    const linkDiv = document.createElement("div");
    const editLink = exports.cardLink(
        itemType, itemId, "edit", ["text-primary"], exports.editClick
        );
    const deleteLink = exports.cardLink(
        itemType, itemId, "delete", ["text-danger"], exports.deleteClick
        );
    linkDiv.append(editLink, deleteLink);
    return linkDiv;
}

exports.itemSubtitle = function(creator, uploaded) {
    const itemSubtitle = document.createElement("h6");
    itemSubtitle.classList.add("card-subtitle", "text-muted");

    const uploadedText = new moment(uploaded).format(config.dateTimeFormat);
    const subtitleText = `${creator} (added ${uploadedText})`;
    itemSubtitle.appendChild(document.createTextNode(subtitleText));

    return itemSubtitle;
}

exports.resultsCard.media = function(item) {

    const itemCard = document.createElement("div");
    itemCard.classList.add("card", "bg-light");
    itemCard.id = ["media", item.id].join("_");

    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body");

    const itemTitle = document.createElement("h5");
    itemTitle.classList.add("card-title");

    const formatText = config.formatName[item.format];

    const nameText = `${item.name} (${formatText}, ${item.duration})`;
    itemTitle.appendChild(document.createTextNode(nameText));
    cardBody.appendChild(itemTitle);


    cardBody.appendChild(exports.itemSubtitle(item.creator, item.uploaded));

    // TODO tags

    cardBody.appendChild(exports.rightsSpan(item.rights));

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

    cardBody.appendChild(exports.linkDiv("media", item.id));

    itemCard.appendChild(cardBody);

    return itemCard;
}

export default exports;
