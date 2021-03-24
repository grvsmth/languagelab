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
import util from "./util.js";

/** Card for editing info about a language in the LanguageLab client */
export default class LanguageFormCard extends React.Component {

    /**
     * Handle a click on the cancel button with a call to the setActivity() prop
     */
    cancelClick() {
        this.props.setActivity("read");
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
                object[item.name] = util.processField(item);
                return object;
            }, {});

        var itemId = null;
        if (typeof this.props.language.id === "number") {
            itemId = this.props.language.id;
        }
        this.props.saveItem(formData, "languages", itemId);
    }

    /**
     * Text input div, pre-populated if we're editing.
     *
     * @param {string} fieldName - the name of the form field
     * @param {func} onChange - the input change handler
     * @param {string} defaultValue - the default value
     *
     * @return {object}
     */
    textInputDiv(fieldName, onChange=null, defaultVal="") {
        var defaultValue = defaultVal;

        if (Object.prototype.hasOwnProperty.call(
            this.props.language,
            fieldName
            )
        ) {
            defaultValue = this.props.language[fieldName];
        }

        return commonElements.textInputDiv(
            fieldName,
            this.props.language.id,
            onChange,
            defaultValue
        )
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
    "setActivity": PropTypes.func.isRequired
};
