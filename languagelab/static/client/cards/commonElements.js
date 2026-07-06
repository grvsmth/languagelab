/**
 * Common React elements used in multiple cards in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

*/
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
        const element = document.createElement("i");
        element.classList.add("oi", iconClass);

        return element;
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
        const element = document.createElement("label");

        element.for = inputId;
        element.innerText = fieldName;

        return element;
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
        const element = document.createElement("input");

        element.classList.add("form-check-input");
        element.type = "checkbox";
        element.id = inputId;
        element.name = name;

        if (callback) {
            element.addEventListener("change", callback);
            element.checked = checked;
        } else {
            element.defaultChecked = checked;
        }

        return element;
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
        const element = document.createElement("option");
        element.value = optionKey;

        element.append(optionValue);

        return element;
    },
    "lessonSubtitle": function(lesson) {
        /**
         * A subtitle showing lesson description, number of exercises and level
         *
         * @param {object} lesson
         *
         * @return {object}
         */
        const element = document.createElement("h6");
        element.classList.add("card-subtitle", "text-dark");

        const howManyExercises = util.howManyExercises(
            lesson.queueItems
        );

        element.append(
            lesson.description,
            ` (${howManyExercises}, level ${lesson.level})`
        );

        return element;
    },
    "textInput": function(fieldName, inputId, onChange, defaultValue, validationCheck) {
        /**
         * Text input element with an optional change handler
         *
         * @param {string} fieldName - the name of the form field
         * @param {string} inputId - the input ID, which can be "initial" or "final"
         * @param {func} onChange - the input change handler
         * @param {string} defaultValue - the default value
         * @param {func} validationCheck - a function to run if we want validation
         *
         * @return {object}
         */
        const element = document.createElement("input");
        element.id = inputId;
        element.classList.add("form-control");
        element.type = "text";
        element.name = fieldName;
        element.defaultValue = defaultValue;

        if (onChange) {
            element.addEventListener("change", onChange);
        }

        if (validationCheck) {
            element.addEventListener("blur", validationCheck);
            element.required = true;
        }

        return element;
    },
    "tagsInput": function(inputId, tags) {
        /**
         * A text input to display the tags as a comma-separated list, for
         * editing
         *
         * @param {number} inputId - the ID of the parent object
         * @param {array} tags - the tags in the parent object
         *
         * @return {object}
         */
        const element = document.createElement("input");
        element.id = inputId;
        element.classList.add("form-control");
        element.type = "text";
        element.name = "tags";
        element.defaultValue = util.joinTags(tags);

        return element;
    }
};

/**
 * An element containing a checkbox with its label to the right
 *
 * @param {string} key - the React key in case it's part of a list
 * @param {string} checked - The HTML "checked" parameter
 * @param {string} labelText
 * @param {string} itemId
 * @param {func} callback - to call when item changed
 *
 * @return {object}
 */
exports.checkboxDiv = function(key, checked, labelText, itemId, callback=null) {
    const inputId = [key, itemId].join("_");

    const element = document.createElement("div");
    element.classList.add("form-check", "form-check-inline", "mx-1");

    element.append(
        exports.checkboxInput(
            key,
            checked,
            inputId,
            callback
        ),
        exports.itemLabel(labelText, inputId)
    );

    return element;
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
    const element = document.createElement("select");
    element.classList.add("form-control");
    element.id = inputId;
    element.name = fieldName;
    element.defaultValue = defaultValue;

    const optionElements = Object.keys(options).map(
        optionKey => exports.itemOption(optionKey, options[optionKey])
    );

    element.append(...optionElements);

    return element;
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
    const element = document.createElement("div");

    element.append(
        exports.itemLabel(fieldName, inputId),
        exports.itemSelect(
            fieldName, optionList, inputId, defaultValue
        )
    );

    return element;
};

/**
 * Text input div, pre-populated if we're editing.  Generate an input ID
 * from the field name and the language ID
 *
 * @param {string} fieldName - the name of the form field
 * @param {string} parentId
 * @param {func} onChange - the input change handler
 * @param {string} defaultValue - the default value
 * @param {func} validationCheck - a function to run if we want validation
 *
 * @return {object}
 */
exports.textInputDiv = function(fieldName, parentId, onChange=null, defaultValue=null, validationCheck=null) {
    const inputId = [fieldName, parentId].join("_");
    const element = document.createElement("div");
    element.classList.add("col-sm");

    element.append(
        exports.itemLabel(fieldName, inputId),
        exports.textInput(fieldName, inputId, onChange, defaultValue, validationCheck)
    );

    return element;
};

/**
 * A badge to highlight each tag
 *
 * @return {object}
 */
exports.tagBadge = function(tagText) {
    const element = document.createElement("span");
    element.classList.add("badge", "badge-pill", "badge-info", "mr-1");

    element.innerText = tagText;

    return element;
};

/**
 * A span with all the tags
 *
 * @return {object}
 */
exports.tagsElement = function(tags, elementType="div") {
    if (tags.length < 1) {
        return null;
    }

    const element = document.createElement(elementType);
    element.append(...tags.map((tag) => {return exports.tagBadge(tag);}));

    return element;
}

export default exports;