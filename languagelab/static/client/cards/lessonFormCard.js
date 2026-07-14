/**
 * Form for adding and editing lessons in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

import commonElements from "./commonElements.js";
import util from "./util.js";

export default class LessonFormCard {

    /**
     * Handle a click on the cancel button with a call to the setActivity() prop
     */
    cancelClick() {
        this.props.setActivity("read");
    }

    /**
     * Handle a click on the save button by harvesting the form items as an
     * array, converting them to an object, and extracting the lesson ID.
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

        let itemId = null;
        if (typeof this.props.lesson.id === "number") {
            itemId = this.props.lesson.id;
        }
        this.props.saveItem(formData, "lessons", itemId);
    }

    /**
     * Call the .reportValidity() method on the form
     *
     */
    reportValidity() {
        console.log("reportValidity", this.props);
        document.querySelector("#form_" + this.props.lesson.id)
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
        let defaultValue = defaultVal;

        if (Object.prototype.hasOwnProperty.call(
            this.props.lesson,
            fieldName
            )
        ) {
            defaultValue = this.props.lesson[fieldName];
        }

        return commonElements.textInputDiv(
            fieldName,
            this.props.lesson.id,
            onChange,
            defaultValue,
            validationCheck
        )
    }

    /**
     * Div for the tags input and its label
     *
     * @return {object}
     */
    tagsInputDiv() {
        const inputId = "tags_" + this.props.lesson.id;

        const element = document.createElement("div");
        element.classList.add("col-sm");

        element.append(
            commonElements.itemLabel("tags", inputId),
            commonElements.tagsInput(inputId, this.props.lesson.tags)
        );

        return element;
    }

    /**
     * A div with textInputDivs for name and description
     *
     * @return {object}
     */
    nameRow() {
        const element = document.createElement("div");
        element.classList.add("form-row", "mt-3");

        element.append(
            this.textInputDiv("name", null, "", this.reportValidity.bind(this)),
            this.textInputDiv("description")
        );

        return element;
    }

    /**
     * A save button handled by saveClick()
     *
     * @return {object}
     */
    saveButton() {
        const element = document.createElement("button");
        element.classList.add("btn", "btn-success", "btn-sm", "m-1");
        element.type = "button";
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

        element.append(
            this.saveButton(),
            this.cancelButton()
        );

        return element;
    }

    /**
     * A row with inputs for notes, tags and level
     *
     * @return {object}
     */
    optionsRow() {
        const element = document.createElement("div");

        element.classList.add("form-row", "mt-3");

        element.append(
            this.textInputDiv("notes"),
            this.tagsInputDiv(),
            this.textInputDiv("level", null, "0")
        );

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
     * The form with inputs and buttons
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("form");
        element.classList.add("card-body");

        element.id = "form_" + this.props.lesson.id;

        element.append(
            this.nameRow(),
            this.optionsRow(),
            this.submitRow()
        );

        return element;
    }

    /**
     * The render() method
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        const element = document.createElement("div");
        element.classList.add("card", "bg-light", "mb-3");

        element.append(this.cardBody());

        return element;
    }
}
