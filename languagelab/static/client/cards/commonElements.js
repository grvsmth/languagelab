/*

    global React

*/
import config from "./config.js";
import util from "./util.js";

const exports = {
    "iconSpan": function(iconClass) {
        return React.createElement(
            "i",
            {"className": "oi " + iconClass},
            null
        );
    },
    "itemLabel": function(fieldName, inputId) {
        return React.createElement(
            "label",
            {"htmlFor": inputId},
            fieldName
        );
    },
    "checkboxInput": function(key, checked, inputId, callback) {
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
    },
    "displayCheckbox": function(key) {
        if (["isAvailable", "isPublic"].includes(key)) {
            return config.hideIsAvailablePublic ? " d-none" : null;
        }

        return null;
    },
    "itemOption": function(optionKey, optionValue) {
        return React.createElement(
            "option",
            {"value": optionKey},
            optionValue
        );
    },
    "lessonSubtitle": function(lesson) {
        const howManyExercises = util.howManyExercises(
            lesson.queueItems
        );

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-dark"},
            lesson.description,
            ` (${howManyExercises}, level ${lesson.level})`
        );
    }
};

exports.checkboxDiv = function(key, checked, labelText, itemId, callback=null) {
    const inputId = [key, itemId].join("_");
    const displayClass = exports.displayCheckbox(key);

    return React.createElement(
        "div",
        {"className": "form-check form-check-inline mx-1" + displayClass},
        exports.checkboxInput(
            key,
            checked,
            inputId,
            callback
        ),
        exports.itemLabel(labelText, inputId)
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

exports.selectDiv = function(fieldName, optionList, parent) {
    if (!optionList) {
        return null;
    }

    const inputId = [fieldName, parent.id].join("_");
    return React.createElement(
        "div",
        {},
        exports.itemLabel(fieldName, inputId),
        exports.itemSelect(
            fieldName, optionList, inputId, parent[fieldName]
        )
    );
};

export default exports;