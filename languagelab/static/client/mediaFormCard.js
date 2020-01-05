import config from "./config.js";

import util from "./util.js";
import commonElements from "./commonElements.js";

export default class MediaFormCard extends React.Component {
    constructor(props) {
        super(props);

        this.cancelClick = this.cancelClick.bind(this);
        this.loadedMetadata = this.loadedMetadata.bind(this);
        this.saveClick = this.saveClick.bind(this);
    }

    inputChange(event) {
        const audio1 = document.querySelector("#audio1");
        audio1.src = event.target.value;
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
        if (node.name === "language") {
            return parseInt(node.value);
        }
        return node.value;
    }

    loadedMetadata(event) {
        const durationMoment = moment.duration(event.target.duration * 1000);

        const durationInputSelector = [
            "#duration",
            this.props.mediaItem.id
            ].join("_");

        const durationInput = document.querySelector(durationInputSelector);
        durationInput.value = util.formatDuration(durationMoment);
    }

    audioElement() {
        const audio = React.createElement(
            "audio",
            {
                "id": "audio1",
                "onLoadedMetadata": this.loadedMetadata
            },
            null
        );
        return audio;
    }

    saveClick(event) {
        const formInputs = document.body.querySelectorAll(
            `#${event.target.form.id} input, select`
        )
        const formData = Array.from(formInputs.values())
            .reduce((object, item) => {
                if (item.name === "mediaFile") {
                    // TODO handle later
                    return object;
                }
                object[item.name] = this.processField(item);
                return object;
            }, {});

        const audio1 = document.querySelector("#audio1");
        var itemId = null;
        if (typeof this.props.mediaItem.id === "number") {
            itemId = this.props.mediaItem.id;
        }
        this.props.saveItem(formData, "media", itemId);
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
        if (this.props.mediaItem.hasOwnProperty(fieldName)) {
            defaultValue = this.props.mediaItem[fieldName];
        }

        const inputId = [fieldName, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel(fieldName, inputId),
            this.textInput(fieldName, inputId, onChange, defaultValue)
        );
    }

    tagsInput(inputId) {
        var defaultValue = "";
        if (this.props.mediaItem.tags) {
            defaultValue = this.props.mediaItem.tags.join(", ");
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
        const inputId = "tags_" + this.props.mediaItem.id;

        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel("tags", inputId),
            this.tagsInput(inputId)
        )
    }

    fileInput(fieldName, inputId) {
        return React.createElement(
            "input",
            {
                "type": "file",
                "className": "form-control-file",
                "id": inputId,
                "name": fieldName
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
                "name": fieldName,
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

    selectDiv(fieldName, optionList) {
        if (!optionList) {
            return null;
        }

        const inputId = [fieldName, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "form-group mx-1"},
            commonElements.itemLabel(fieldName, inputId),
            this.itemSelect(fieldName, optionList, inputId)
        );
    }

    nameRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            this.textInputDiv("name"),
            this.textInputDiv("creator"),
            this.textInputDiv("rights")
        );
    }

    fileRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            this.textInputDiv("mediaUrl", this.inputChange),
            this.fileInputDiv("mediaFile"),
            this.textInputDiv("duration", null, "00:00:00"),
            this.audioElement()
        );
    }

    languageObject() {
        const languageObject = this.props.languages.reduce((object, item) => {
            object[item.id] = item.name;
            return object;
        }, {});
        return languageObject;
    }

    saveButton() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-success btn-sm m-1",
                "onClick": this.saveClick
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
                "onClick": this.cancelClick
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
            this.tagsInputDiv(),
            this.selectDiv("format", config.formatName),
            this.selectDiv("language", this.languageObject()),
            commonElements.checkboxDiv(
                "isAvailable",
                this.props.mediaItem.isAvailable,
                "available",
                this.props.mediaItem.id
            ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.mediaItem.isPublic,
                "public",
                this.props.mediaItem.id
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
                "id": "form_" + this.props.mediaItem.id
            },
            this.nameRow(),
            this.fileRow(),
            this.optionsRow(),
            this.submitRow()
        );
    }

    render() {
        console.log(this.props);
        return React.createElement(
            "div",
            {"className": "card bg-light mb-3"},
            this.cardBody()
        );
    }

}