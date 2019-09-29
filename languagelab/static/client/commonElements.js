const exports = {};

exports.itemLabel = function(fieldName, inputId) {
    return React.createElement(
        "label",
        {"htmlFor": inputId},
        fieldName
    );
};

exports.checkboxInput = function(key, checked, inputId, callback) {
    return React.createElement(
        "input",
        {
            "className": "form-check-input",
            "type": "checkbox",
            "onChange": callback,
            "id": inputId,
            "name": key,
            "checked": checked
        },
        null
    );
};

exports.checkboxDiv = function(key, checked, labelText, itemId, callback) {
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





export default exports;