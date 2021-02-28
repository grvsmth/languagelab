/**
 * Card for editing info about a language in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

 /*

    global React, PropTypes

*/
import commonElements from "./commonElements.js";

/** Card for editing info about a language in the LanguageLab client */
export default class LanguageFormCard extends React.Component {

    /**
     * Handle a click on the cancel button with a call to the setActivity() prop
     */
    cancelClick() {
        this.props.setActivity("read");
    }

    /**
     * Return the value of a form field node unless it's a checkbox, in which
     * case we return the boolean.  Let's call it a string, since that's what
     * it's all going to get converted to in the end...
     *
     * @return {string}
     */
    processField(node) {
        if (node.type === "checkbox") {
            return node.checked;
        }
        return node.value;
    }

    /**
     * Handle a click on the save button by harvesting the form items as an
     * array, converting them to an object, and extracting the language ID.
     * Pass it all to this.props.saveItem().
     *
     * @param {object} event - the click event that this handles
     */
    saveClick(event) {
        const formInputs = document.body.querySelectorAll(
            `#${event.target.form.id} input, select`
        )
        const formData = Array.from(formInputs.values())
            .reduce((object, item) => {
                object[item.name] = this.processField(item);
                return object;
            }, {});

        var itemId = null;
        if (typeof this.props.language.id === "number") {
            itemId = this.props.language.id;
        }
        this.props.saveItem(formData, "languages", itemId);
    }

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
    textInput(fieldName, inputId, onChange, defaultValue) {
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

    /**
     * Text input div, pre-populated if we're editing.  Generate an input ID
     * from the field name and the language ID
     *
     * @param {string} fieldName - the name of the form field
     * @param {func} onChange - the input change handler
     * @param {string} defaultValue - the default value
     *
     * @return {object}
     */
    textInputDiv(fieldName, onChange=null, defaultVal=null) {
        var defaultValue = "";

        if (defaultVal) {
            defaultValue = defaultVal;
        }

        if (Object.prototype.hasOwnProperty.call(
            this.props.language,
            fieldName
            )
        ) {
            defaultValue = this.props.language[fieldName];
        }

        const inputId = [fieldName, this.props.language.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel(fieldName, inputId),
            this.textInput(fieldName, inputId, onChange, defaultValue)
        );
    }

    /**
     * Item option element to be mapped to the parameters of the options object
     *
     * @param {string} optionKey
     * @param {string} optionValue
     *
     * @return {object}
     */
    itemOption(optionKey, optionValue) {
        return React.createElement(
            "option",
            {"value": optionKey},
            optionValue
        );
    }

    /**
     * Create a Select form element for a field with a key/value object of
     * options
     *
     * @param {string} fieldName - The field name
     * @param {object} options - The options as key/value pairs
     * @param {string} inputId
     *
     * @return {object}
     */
    itemSelect(fieldName, options, inputId) {
        return React.createElement(
            "select",
            {
                "className": "form-control",
                "id": inputId,
                "name": fieldName,
                "defaultValue": this.props.language[fieldName]
            },
            ...Object.keys(options).map((optionKey) => {
                return this.itemOption(
                    optionKey,
                    options[optionKey]
                );
            })
        );
    }

    /**
     * Create a select div with an input ID generated
     * from the field name and the language ID
     *
     * @param {string} fieldName
     * @param {object} optionList
     *
     * @return {object}
     */
    selectDiv(fieldName, optionList) {
        if (!optionList) {
            return null;
        }

        const inputId = [fieldName, this.props.language.id].join("_");
        return React.createElement(
            "div",
            {"className": "form-group mx-1"},
            commonElements.itemLabel(fieldName, inputId),
            this.itemSelect(fieldName, optionList, inputId)
        );
    }

    /**
     * A div with textInputDivs for name, creator, rights
     *
     * @return {object}
     */
    nameRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            this.textInputDiv("name"),
            this.textInputDiv("creator"),
            this.textInputDiv("rights")
        );
    }

    /**
     * A save button handled by saveClick()
     *
     * @return {object}
     */
    saveButton() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-success btn-sm m-1",
                "onClick": this.saveClick.bind(this)
            },
            "Save"
        );
    }

    /**
     * A cancel button handled by cancelClick()
     *
     * @return {object}
     */
    cancelButton() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-danger btn-sm m-1",
                "onClick": this.cancelClick.bind(this)
            },
            "Cancel"
        );
    }

    /**
     * A div for the buttons
     *
     * @return {object}
     */
    buttonDiv() {
        return React.createElement(
            "div",
            {"className": "col"},
            this.saveButton(),
            this.cancelButton()
        );
    }

    /**
     * A div for the save and cancel buttons with form row styling
     *
     * @return {object}
     */
    submitRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.buttonDiv()
        );
    }

    /**
     * The form with inputs for name and code, and a submit button
     *
     * @return {object}
     */
    cardBody() {
        return React.createElement(
            "form",
            {
                "className": "card-body",
                "id": "form_" + this.props.language.id
            },
            this.textInputDiv("name"),
            this.textInputDiv("code"),
            this.submitRow()
        );
    }

    /**
     * The React render() method
     *
     * @return {object}
     */
    render() {
        return React.createElement(
            "div",
            {"className": "card bg-light border-warning mb-3"},
            this.cardBody()
        );
    }
}

LanguageFormCard.propTypes = {
    "language": PropTypes.object.isRequired,
    "saveItem": PropTypes.func.isRequired,
    "setActivity": PropTypes.func.isrequired
};
