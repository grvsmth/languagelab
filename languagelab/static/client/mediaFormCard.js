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

    checkboxClick(event) {
        this.props.checkClick(
            "media",
            this.props.mediaItem.id,
            event.target.name,
            event.target.checked
        )
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

    fileInfo() {
        if (!this.props.mediaItem.mediaFile) {
            return null;
        }

        const fileUrlParts = this.props.mediaItem.mediaFile.split("/");
        const fileNameSpan = React.createElement(
            "span",
            {"className": "text-success"},
            fileUrlParts[fileUrlParts.length-1]
        );

        return React.createElement(
            "span",
            {"className": "badge"},
            "uploaded media file is ",
            fileNameSpan
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
            commonElements.itemLabel("or upload a file", inputId),
            this.fileInput(fieldName, inputId),
            this.fileInfo()
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

    nameRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.textInputDiv("name"),
            this.textInputDiv("creator"),
            this.textInputDiv("rights")
        );
    }

    fileRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.textInputDiv("mediaUrl"),
            this.fileInputDiv("mediaFile")
        );
    }

    optionsRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            commonElements.checkboxDiv(
                "isAvailable",
                this.props.mediaItem.isAvailable,
                "available",
                this.props.mediaItem.id,
                this.checkboxClick.bind(this)
            ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.mediaItem.isPublic,
                "public",
                this.props.mediaItem.id,
                this.checkboxClick.bind(this)
            ),
            this.selectDiv("format")
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.nameRow(),
            this.fileRow(),
            this.optionsRow()
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