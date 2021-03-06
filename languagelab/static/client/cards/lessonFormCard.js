/**
 * Form for adding and editing lessons in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, PropTypes

*/
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class LessonFormCard extends React.Component {

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

        var itemId = null;
        if (typeof this.props.lesson.id === "number") {
            itemId = this.props.lesson.id;
        }
        this.props.saveItem(formData, "lessons", itemId);
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
            defaultValue
        )
    }

    /**
     * Div for the tags input and its label
     *
     * @return {object}
     */
    tagsInputDiv() {
        const inputId = "tags_" + this.props.lesson.id;

        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel("tags", inputId),
            commonElements.tagsInput(inputId, this.props.lesson.tags)
        )
    }

    /**
     * A div with textInputDivs for name and description
     *
     * The "isAvailable" and "isPublic" checkboxes are currently not
     * implemented, but this is what would display them
     *
     * @return {object}
     */
    nameRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            this.textInputDiv("name"),
            this.textInputDiv("description"),
            commonElements.checkboxDiv(
                "isAvailable",
                this.props.lesson.isAvailable,
                "available",
                this.props.lesson.id
            ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.lesson.isPublic,
                "public",
                this.props.lesson.id
            )
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
     * A row with inputs for notes, tags and level
     *
     * @return {object}
     */
    optionsRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            this.textInputDiv("notes"),
            this.tagsInputDiv(),
            this.textInputDiv("level", null, "0")
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
     * The form with inputs and buttons
     *
     * @return {object}
     */
    cardBody() {
        return React.createElement(
            "form",
            {
                "className": "card-body",
                "id": "form_" + this.props.lesson.id
            },
            this.nameRow(),
            this.optionsRow(),
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
            {"className": "card bg-light mb-3"},
            this.cardBody()
        );
    }
}

LessonFormCard.propTypes = {
    "lesson": PropTypes.object.isRequired,
    "setActivity": PropTypes.func.isRequired,
    "saveItem": PropTypes.func.isRequired
};
