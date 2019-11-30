import config from "./config.js";

import util from "./util.js";
import commonElements from "./commonElements.js";

export default class ExerciseFormCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    inputChange(event) {
    }

    cancelClick() {
        this.props.setActivity("read");
    }

    processField(node) {
        if (node.type === "checkbox") {
            return node.checked;
        }
        return node.value;
    }

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
        if (this.props.exercise.id !== "form") {
            itemId = this.props.exercise.id;
        }

        this.props.saveItem(formData, this.props.selectedType, itemId);

    }

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

    textInputDiv(fieldName, onChange=null, defaultVal=null) {
        var defaultValue = "";

        if (defaultVal) {
            defaultValue = defaultVal;
        }
        if (this.props.exercise.hasOwnProperty(fieldName)) {
            defaultValue = this.props.exercise[fieldName];
        }

        const inputId = [fieldName, this.props.exercise.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel(fieldName, inputId),
            this.textInput(fieldName, inputId, onChange, defaultValue)
        );
    }

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

    buttonDiv() {
        return React.createElement(
            "div",
            {"className": "col"},
            this.saveButton(),
            this.cancelButton()
        );
    }    itemOption(optionKey, optionValue) {
        return React.createElement(
            "option",
            {"value": optionKey},
            optionValue
        );
    }

    itemSelect(fieldName, options, inputId) {
        return React.createElement(
            "select",
            {
                "className": "form-control",
                "id": inputId,
                "name": fieldName,
                "defaultValue": this.props.exercise[fieldName]
            },
            ...Object.keys(options).map((optionKey) => {
                return this.itemOption(
                    optionKey,
                    options[optionKey]
                );
            })
        );
    }

    selectDiv(fieldName, optionList) {
        if (!optionList) {
            return null;
        }

        const inputId = [fieldName, this.props.exercise.id].join("_");
        return React.createElement(
            "div",
            {},
            commonElements.itemLabel(fieldName, inputId),
            this.itemSelect(fieldName, optionList, inputId)
        );
    }

    mediaRow() {
        return React.createElement(
            "div",
            {"class-name": "form-row-mt-3"},
            this.selectDiv("media", util.listToObject(this.props.media))
        )

    }

    checkboxRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            commonElements.checkboxDiv(
                "isAvailable",
                this.props.exercise.isAvailable,
                "available",
                this.props.exercise.id
            ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.exercise.isPublic,
                "public",
                this.props.exercise.id
            )
        );
    }

    submitRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.buttonDiv()
        );
    }

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

    render() {

        return React.createElement(
            "div",
            {"className": "card bg-light"},
            this.cardBody()
        );
    }

}