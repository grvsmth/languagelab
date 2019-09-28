import config from "./config.js";
import apiClient from "./apiClient.js";

const exports = {
    "resultsCard": {},
    "formCard": {}
};


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

exports.editClick = function(event) {
    console.log("editClick()", event.target.id);
    const idPart = event.target.id.split("_");
    const itemType = idPart[0];

    const mediaCard = event.target.parentNode.parentNode;
    const newCard = exports.formCard[itemType]({});
    mediaCard.parentNode.replaceChild(newCard, mediaCard);
};

exports.deleteClick = function(event) {
    console.log(`deleteClick(${event.target.id})`);
};

exports.itemTitle = function(itemName, itemFormat, itemDuration) {
    const itemTitle = document.createElement("h5");
    itemTitle.classList.add("card-title");

    const formatText = config.formatName[itemFormat];

    const nameText = `${itemName} (${formatText}, ${itemDuration})`;
    itemTitle.appendChild(document.createTextNode(nameText));

    return itemTitle;
};

exports.itemSubtitle = function(creator, uploaded) {
    const itemSubtitle = document.createElement("h6");
    itemSubtitle.classList.add("card-subtitle", "text-muted");

    const uploadedText = new moment(uploaded).format(config.dateTimeFormat);
    const subtitleText = `${creator} (added ${uploadedText})`;
    itemSubtitle.appendChild(document.createTextNode(subtitleText));

    return itemSubtitle;
};

exports.rightsSpan = function(rightsText) {
    const rightsSpan = document.createElement("span");
    rightsSpan.classList.add("card-text", "mr-2");
    rightsSpan.appendChild(document.createTextNode(rightsText));
    return rightsSpan;
}

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

exports.resultsCard.media = function(item) {

    const itemCard = document.createElement("div");
    itemCard.classList.add("card", "bg-light");
    itemCard.id = ["media", item.id].join("_");

    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body");

    // TODO tags

    cardBody.append(
        exports.itemTitle(item.name, item.format, item.duration),
        exports.itemSubtitle(item.creator, item.uploaded),
        exports.rightsSpan(item.rights),
        exports.makeCheckbox(
            "media", "isAvailable", "available", item.id, item.isAvailable
        ),
        exports.makeCheckbox(
            "media", "isPublic", "public", item.id, item.isPublic
        ),
        exports.linkDiv("media", item.id)
    );

    itemCard.appendChild(cardBody);

    return itemCard;
}

exports.makeLabel = function(inputId, labelText) {
    const itemLabel = document.createElement("label");
    itemLabel.for = inputId;
    itemLabel.append(document.createTextNode(labelText));
    return itemLabel;
}

exports.textInput = function(itemType, itemId, fieldName, fieldValue) {
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("form-group", "col-sm");

    const inputId = [itemType, fieldName, itemId].join("_");
    const itemLabel = document.createElement("label");
    itemLabel.for = inputId;
    itemLabel.append(document.createTextNode(fieldName));

    const itemInput = document.createElement("input");
    itemInput.classList.add("form-control");
    itemInput.id = inputId;
    if (fieldValue) {
        itemInput.value = fieldValue;
    }

    inputDiv.append(itemLabel, itemInput);
    return inputDiv;
};

exports.fileInput = function(itemType, itemId, fieldName, fieldValue) {
    const fileLabel = "or upload a file";

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("form-group");

    const inputId = [itemType, fieldName, itemId].join("_");

    const itemLabel = exports.makeLabel(inputId, fieldName);

    const itemInput = document.createElement("input");
    itemInput.classList.add("form-control-file");
    itemInput.type = "file";
    itemInput.id = inputId;

    if (fieldValue) {
        itemInput.value = fieldValue;
    }
    inputDiv.append(itemLabel, itemInput);
    return inputDiv;
};

exports.hiddenInput = function(itemName, itemValue) {
    const inputSpan = document.createElement("span");

    const inputElement = document.createElement("input");
    inputElement.type = "hidden";
    inputElement.name = itemName;
    inputElement.value = itemValue;
    return inputElement;
};

exports.formatOption = function(formatChoices, selectedValue) {
    var options = [];
    for (let choiceValue in formatChoices) {
        const optionElement = document.createElement("option");
        optionElement.value = choiceValue;
        if (choiceValue === selectedValue) {
            optionElement.selected = true;
        }

        let choiceTextNode = document.createTextNode(formatChoices[choiceValue]);
        optionElement.append(choiceTextNode);
        options.push(optionElement);
    }
    return options;
};

exports.formatSelect = function(itemType, itemId, fieldName, fieldValue) {
    const selectGroup = document.createElement("div");
    selectGroup.classList.add("form-group");

    const inputId = [itemType, fieldName, itemId].join("_");
    const itemLabel = exports.makeLabel(inputId, fieldName);

    const itemSelect = document.createElement("select");
    itemSelect.classList.add("form-control");
    itemSelect.id = inputId;

    const formatOptions = exports.formatOption(config.formatName, fieldValue);
    itemSelect.append(...formatOptions);

    selectGroup.append(itemLabel, itemSelect);
    return selectGroup;
};

exports.formCard.media = function(item={}) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("card", "bg-info");

    if (!item.hasOwnProperty("id")) {
        item = {
            "id": "form",
            "name": ""
        }
    }
    itemCard.id = ["media", item.id].join("_");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardForm = document.createElement("form");

    const firstRow = document.createElement("div");
    firstRow.classList.add("form-row");

    firstRow.append(
        exports.hiddenInput("mediaId", item.id),
        exports.textInput("media", item.id, "name", item.name),
        exports.textInput("media", item.id, "creator", item.creator),
        exports.textInput("media", item.id, "rights", item.rights),
    );

    const sourceGroup = document.createElement("div");
    sourceGroup.classList.add("form-row")

    sourceGroup.append(
        exports.textInput("media", item.id, "mediaUrl", item.mediaUrl),
        exports.fileInput("media", item.id, "mediaFile", item.mediaFile),
        exports.formatSelect("media", item.id, "format", config.formatName)
    );

    const checkboxGroup = document.createElement("div");
    checkboxGroup.classList.add("form-group");

    checkboxGroup.append(
        exports.makeCheckbox(
            "media", "isAvailable", "available", item.id, item.isAvailable
        ),
        exports.makeCheckbox(
            "media", "isPublic", "public", item.id, item.isPublic
        )
    );

    const thirdRow = document.createElement("div");
    thirdRow.classList.add("form-row");

    thirdRow.append(
        checkboxGroup
    );

    cardForm.append(
        firstRow,
        sourceGroup,
        thirdRow
    );

    cardBody.append(cardForm);
    itemCard.append(cardBody);
    return itemCard;
};

export default exports;
