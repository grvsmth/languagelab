/*

    global React, PropTypes

*/
import config from "./config.js";

import commonElements from "./commonElements.js";

export default class LessonFormCard extends React.Component {
    constructor(props) {
        super(props);

    }

    cancelClick() {
        this.props.setActivity("read");
    }

    processField(node) {
        if (node.type === "checkbox") {
            return node.checked;
        }
        if (node.name === "tags") {
            if (node.value.length < 1) {
                return [];
            }
            const tags = node.value.split(config.tagSplitRE);
            return tags;
        }
        return node.value;
    }

    saveClick(event) {
        const formInputs = document.body.querySelectorAll(
            `#${event.target.form.id} input, select`
        )
        const formData = Array.from(formInputs.values())
            .reduce((object, item) => {
                if (item.name === "lessonFile") {
                    // TODO handle later
                    return object;
                }
                object[item.name] = this.processField(item);
                return object;
            }, {});

        var itemId = null;
        if (typeof this.props.lesson.id === "number") {
            itemId = this.props.lesson.id;
        }
        this.props.saveItem(formData, "lessons", itemId);
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
        if (Object.prototype.hasOwnProperty.call(
            this.props.lesson,
            fieldName
            )
        ) {
            defaultValue = this.props.lesson[fieldName];
        }

        const inputId = [fieldName, this.props.lesson.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel(fieldName, inputId),
            this.textInput(fieldName, inputId, onChange, defaultValue)
        );
    }

    tagsInput(inputId) {
        var defaultValue = "";
        if (this.props.lesson.tags) {
            defaultValue = this.props.lesson.tags.join(", ");
        }
        return React.createElement(
            "input",
            {
                "id": inputId,
                "className": "form-control",
                "type": "text",
                "name": "tags",
                "defaultValue": defaultValue
            },
            null
        );
    }

    tagsInputDiv() {
        const inputId = "tags_" + this.props.lesson.id;

        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel("tags", inputId),
            this.tagsInput(inputId)
        )
    }

    itemSelect(fieldName, options, inputId) {
        return React.createElement(
            "select",
            {
                "className": "form-control",
                "id": inputId,
                "name": fieldName,
                "defaultValue": this.props.lesson[fieldName]
            },
            ...Object.keys(options).map((optionKey) => {
                return commonElements.itemOption(
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

        const inputId = [fieldName, this.props.lesson.id].join("_");
        return React.createElement(
            "div",
            {"className": "form-group mx-1"},
            commonElements.itemLabel(fieldName, inputId),
            this.itemSelect(fieldName, optionList, inputId)
        );
    }

    nameRow() {
        /*

            The "isAvailable" and "isPublic" checkboxes are currently not
            implemented, but this is what would display them



        */
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
    }

    optionsRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            this.textInputDiv("notes"),
            this.tagsInputDiv(),
            this.textInputDiv("level", null, "0")
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
                "id": "form_" + this.props.lesson.id
            },
            this.nameRow(),
            this.optionsRow(),
            this.submitRow()
        );
    }

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
