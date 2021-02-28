/*

    global React, PropTypes

*/
import util from "./util.js";
import commonElements from "./commonElements.js";

export default class ExerciseFormCard extends React.Component {

    /**
     * Handle a click on the cancel button with a call to the setActivity() prop
     */
    cancelClick() {
        this.props.setActivity("read");
    }

    /**
     * Handle a click on the save button by harvesting the form items as an
     * array, converting them to an object, and extracting the exercise ID.
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
        if (typeof this.props.exercise.id === "number") {
            itemId = this.props.exercise.id;
        }

        this.props.saveItem(formData, this.props.selectedType, itemId);

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
            this.props.exercise,
            fieldName
            )
        ) {
            defaultValue = this.props.exercise[fieldName];
        }

        return commonElements.textInputDiv(
            fieldName,
            this.props.exercise.id,
            onChange,
            defaultValue
        )
    }

    /**
     * A div with textInputDivs for name and description
     *
     * @return {object}
     */
    nameRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.textInputDiv("name"),
            this.textInputDiv("description")
        );
    }

    timeRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.textInputDiv("startTime", null, "00:00:00"),
            this.textInputDiv("endTime", null, "00:00:00")
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

    mediaRow() {
        return React.createElement(
            "div",
            {"class-name": "form-row-mt-3"},
            commonElements.selectDiv(
                "media",
                util.listToObject(this.props.media),
                this.props.exercise.id,
                this.props.exercise.media
            )
        )

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
                "id": "form_" + this.props.exercise.id
            },
            this.nameRow(),
            this.mediaRow(),
            this.timeRow(),
            this.checkboxRow(),
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

ExerciseFormCard.propTypes = {
    "exercise": PropTypes.object.isRequired,
    "media": PropTypes.array.isRequired,
    "saveItem": PropTypes.func.isRequired,
    "selectedType": PropTypes.string.isRequired,
    "setActivity": PropTypes.func.isRequired
};
