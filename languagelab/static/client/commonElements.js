const exports = {};

exports.iconSpan = function(iconClass) {
    return React.createElement(
        "i",
        {"className": "oi " + iconClass},
        null
    );
};

exports.itemLabel = function(fieldName, inputId) {
    return React.createElement(
        "label",
        {"htmlFor": inputId},
        fieldName
    );
};

exports.checkboxInput = function(key, checked, inputId, callback) {
    var options = {
        "className": "form-check-input",
        "type": "checkbox",
        "id": inputId,
        "name": key
    }
    if (callback) {
        options.onChange = callback;
        options.checked = checked;
    } else {
        options.defaultChecked = checked;
    }

    return React.createElement(
        "input",
        options,
        null
    );
};

exports.checkboxDiv = function(key, checked, labelText, itemId, callback=null) {
    const inputId = [key, itemId].join("_");
    return React.createElement(
        "div",
        {"className": "form-check form-check-inline mx-1"},
        exports.checkboxInput(
            key,
            checked,
            inputId,
            callback
        ),
        exports.itemLabel(labelText, inputId)
    );
};

exports.itemOption = function(optionKey, optionValue) {
    return React.createElement(
        "option",
        {"value": optionKey},
        optionValue
    );
};

exports.itemSelect = function(fieldName, options, inputId, defaultValue) {
    return React.createElement(
        "select",
        {
            "className": "form-control",
            "id": inputId,
            "name": fieldName,
            "defaultValue": defaultValue
        },
        ...Object.keys(options).map((optionKey) => {
            return exports.itemOption(
                optionKey,
                options[optionKey]
            );
        })
    );
};

export default exports;