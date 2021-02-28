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
    },
    "textInput": function(fieldName, inputId, onChange, defaultValue) {
        /**
         * Text input element with an optional change handler
         *
         * @param {string} fieldName - the name of the form field
         * @param {string} inputId - the input ID, which can be "initial" or "final"
         * @param {func} onChange - the input change handler
         * @param {string} defaultValue - the default value
         *
         * @return {object}
         */
        const options = {
            "id": inputId,
            "className": "form-control",
            "type": "text",
            "name": fieldName,
            "defaultValue": defaultValue
        };
        if (onChange) {
            options.onChange = onChange;
        }

        return React.createElement(
            "input",
            options,
            null
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

/**
 * A div with a label and an item selector
 *
 * @param {string} fieldName - The field name
 * @param {object} options - The options as key/value pairs
 * @param {string} parentId
 * @param {string} defaultValue
 *
 * @return {object}
 */
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

/**
 * Text input div, pre-populated if we're editing.  Generate an input ID
 * from the field name and the language ID
 *
 * @param {string} fieldName - the name of the form field
 * @param {string} parentId
 * @param {func} onChange - the input change handler
 * @param {string} defaultValue - the default value
 *
 * @return {object}
 */
exports.textInputDiv = function(fieldName, parentId, onChange=null, defaultValue=null) {
    const inputId = [fieldName, parentId].join("_");
    return React.createElement(
        "div",
        {"className": "col-sm"},
        exports.itemLabel(fieldName, inputId),
        exports.textInput(fieldName, inputId, onChange, defaultValue)
    );
};


export default exports;