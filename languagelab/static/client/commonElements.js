const exports = {};

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





export default exports;