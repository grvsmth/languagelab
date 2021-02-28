/**
 * Common React elements used in multiple cards in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React

*/
import config from "./config.js";
import util from "./util.js";

const exports = {
    "iconSpan": function(iconClass) {
        /**
         * An <i> element with a Bootstrap/FontAwesome-type icon class
         *
         * @param {string} iconClass - the name of the desired icon class
         *
         * @return {object}
         */
        return React.createElement(
            "i",
            {"className": "oi " + iconClass},
            null
        );
    },
    "itemLabel": function(fieldName, inputId) {
        /**
         * A label element displaying the fieldName, attached to the inputId
         *
         * @param {string} fieldName
         * @param {string} inputId
         *
         * @return {object}
         */
        return React.createElement(
            "label",
            {"htmlFor": inputId},
            fieldName
        );
    },
    "checkboxInput": function(name, checked, inputId, callback) {
        /**
         * A checkbox input with callback
         *
         * @param {string} name
         * @param {boolean} checked
         * @param {string} inputId
         * @param {func} callback
         */
        const options = {
            "className": "form-check-input",
            "type": "checkbox",
            "id": inputId,
            "name": name
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
        /**
         * If we've configured the system to hide the (currently non-functional)
         * isAvailable and isPublic checkboxes, then return the appropriate
         * Bootstrap class
         *
         * @param key - the name of the key
         *
         * @return {string}
         */
        if (["isAvailable", "isPublic"].includes(key)) {
            return config.hideIsAvailablePublic ? " d-none" : null;
        }

        return null;
    },
    "itemOption": function(optionKey, optionValue) {
        /**
         * Item option element to be mapped to the parameters of the options object
         *
         * @param {string} optionKey
         * @param {string} optionValue
         *
         * @return {object}
         */
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

/**
 * Create a Select form element for a field with a key/value object of
 * options
 *
 * @param {string} fieldName - The field name
 * @param {object} options - The options as key/value pairs
 * @param {string} inputId
 * @param {string} defaultValue
 *
 * @return {object}
 */
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

exports.selectDiv = function(fieldName, optionList, parentId, defaultValue) {
    if (!optionList) {
        return null;
    }

    const inputId = [fieldName, parentId].join("_");
    return React.createElement(
        "div",
        {},
        exports.itemLabel(fieldName, inputId),
        exports.itemSelect(
            fieldName, optionList, inputId, defaultValue
        )
    );
};

export default exports;