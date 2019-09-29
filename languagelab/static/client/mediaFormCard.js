import config from "./config.js";

export default class MediaCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    inputChange(event) {
        console.dir(event);
    }

    itemLabel(fieldName, inputId) {
        return React.createElement(
            "label",
            {"htmlFor": inputId},
            fieldName
        );
    }

    textInput(fieldName, inputId) {
        return React.createElement(
            "input",
            {
                "id": inputId,
                "className": "form-control",
                "type": "text",
                "value": this.props.mediaItem[fieldName],
                "onChange": this.inputChange
            },
            null
        );
    }

    textInputDiv(fieldName) {
        const inputId = [fieldName, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            this.itemLabel(fieldName, inputId),
            this.textInput(fieldName, inputId)
        );
    }

    fileInput(fieldName, inputId) {
        return React.createElement(
            "input",
            {
                "type": "file",
                "className": "form-control-file",
                "id": inputId,
                "onChange": this.inputChange
            },
            null
        );
    }

    fileInputDiv(fieldName) {
        const fileLabel = "or upload a file";
        const inputId = [fieldName, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            this.itemLabel(fileLabel, inputId),
            this.fileInput(fieldName, inputId)
        );
    }

    itemOption(optionKey, optionValue) {
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
                "defaultValue": this.props.mediaItem[fieldName]
            },
            ...Object.keys(options).map((optionKey) => {
                return this.itemOption(
                    optionKey,
                    options[optionKey]
                );
            })
        );
    }

    selectDiv(fieldName) {
        const inputId = [fieldName, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "form-group"},
            this.itemLabel(fieldName, inputId),
            this.itemSelect(fieldName, config.formatName)
        );
    }

    firstRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.textInputDiv("name"),
            this.textInputDiv("creator"),
            this.textInputDiv("rights")
        );
    }

    secondRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.textInputDiv("mediaUrl"),
            this.fileInputDiv("mediaFile"),
            this.selectDiv("format")
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.firstRow(),
            this.secondRow()
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