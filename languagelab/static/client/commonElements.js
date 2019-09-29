const exports = {};

exports.itemLabel = function(fieldName, inputId) {
    return React.createElement(
        "label",
        {"htmlFor": inputId},
        fieldName
    );
};

export default exports;