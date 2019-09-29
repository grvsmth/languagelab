import config from "./config.js";
import commonElements from "./commonElements.js";

export default class MediaCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    inputChange(event) {
        console.dir(event);
    }

    textInput(fieldName, inputId) {
        return React.createElement(
            "input",
            {
                "id": inputId,
                "className": "form-control",
                "type": "text",
                "name": fieldName,
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
            commonElements.itemLabel(fieldName, inputId),
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
                "name": fieldName,
                "onChange": this.inputChange
            },
            null
        );
    }

    fileLabel(fieldName, inputId) {
        if (!this.props.mediaItem[fieldName]) {
            return commonElements.itemLabel("or upload a file", inputId);
        }

        const fileUrlParts = this.props.mediaItem[fieldName].split("/");
        const fileNameSpan = React.createElement(
            "span",
            {"className": "text-success"},
            fileUrlParts[fileUrlParts.length-1]
        );

        return React.createElement(
            "label",
            {"htmlFor": inputId},
            "or upload a file to replace ",
            fileNameSpan
        );

    }

    fileInputDiv(fieldName) {
        const inputId = [fieldName, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            this.fileLabel(fieldName, inputId),
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
            commonElements.itemLabel(fieldName, inputId),
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
            this.selectDiv("format")
        );
    }

    thirdRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.fileInputDiv("mediaFile")
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.firstRow(),
            this.secondRow(),
            this.thirdRow()
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