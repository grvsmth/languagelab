/**
 * Card for editing info about a language in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

import commonElements from "./commonElements.js";
import util from "./util.js";

/** Card for editing info about a language in the LanguageLab client */
export default class LanguageFormCard {

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
     * Call the .reportValidity() method on the form
     *
     */
    reportValidity() {
        document.querySelector("#form_" + this.props.language.id)
            .reportValidity();
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
    textInputDiv(fieldName, onChange=null, defaultVal="", validationCheck=null) {
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
            defaultValue,
            validationCheck
        )
    }

    /**
     * A save button handled by saveClick()
     *
     * @return {object}
     */
    saveButton() {
        const element = document.createElement("button");
        element.type = "button";
        element.classList.add("btn", "btn-success", "btn-sm", "m-1");
        element.addEventListener("click", this.saveClick.bind(this));
        element.innerText = "Save";

        return element;
    }

    /**
     * A cancel button handled by cancelClick()
     *
     * @return {object}
     */
    cancelButton() {
        const element = document.createElement("button");
        element.type = "button";
        element.classList.add("btn", "btn-danger", "btn-sm", "m-1");
        element.addEventListener("click", this.cancelClick.bind(this));
        element.innerText = "Cancel";

        return element;
    }

    /**
     * A div for the buttons
     *
     * @return {object}
     */
    buttonDiv() {
        const element = document.createElement("div");
        element.classList.add("col");
        element.append(this.saveButton(), this.cancelButton());

        return element;
    }

    /**
     * A div for the save and cancel buttons with form row styling
     *
     * @return {object}
     */
    submitRow() {
        const element = document.createElement("div");
        element.classList.add("form-row");
        element.append(this.buttonDiv());

        return element;
    }

    /**
     * The form with inputs for name and code, and a submit button
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("form");
        element.classList.add("card-body");
        element.id = "form_" + this.props.language.id;

        element.append(
            this.textInputDiv("name", null, "", this.reportValidity.bind(this)),
            this.textInputDiv("code", null, "", this.reportValidity.bind(this)),
            this.submitRow()
        );

        return element;
    }

    /**
     * The React render() method
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        const element = document.createElement("div");
        element.classList.add("card", "bg-light", "border-warning", "mb-3");
        element.append(this.cardBody());

        return element;
    }
}
