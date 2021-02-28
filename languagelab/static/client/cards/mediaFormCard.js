/*

    global React, moment, PropTypes

*/
import config from "./config.js";

import util from "./util.js";
import commonElements from "./commonElements.js";

export default class MediaFormCard extends React.Component {
    constructor(props) {
        super(props);

        this.audio = React.createRef();
    }

    inputChange(event) {
        this.audio.current.src = event.target.value;
    }

    /**
     * Handle a click on the cancel button with a call to the setActivity() prop
     */
    cancelClick() {
        this.props.setActivity("read");
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
                "onLoadedMetadata": this.loadedMetadata.bind(this),
                "ref": this.audio
            },
            null
        );
        return audio;
    }

    /**
     * Handle a click on the save button by harvesting the form items as an
     * array, converting them to an object, and extracting the media ID.
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
        if (typeof this.props.mediaItem.id === "number") {
            itemId = this.props.mediaItem.id;
        }
        this.props.saveItem(formData, "media", itemId);
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
            this.props.mediaItem,
            fieldName
            )
        ) {
            defaultValue = this.props.mediaItem[fieldName];
        }

        return commonElements.textInputDiv(
            fieldName,
            this.props.mediaItem.id,
            onChange,
            defaultValue
        )
    }

    tagsInputDiv() {
        const inputId = "tags_" + this.props.mediaItem.id;

        return React.createElement(
            "div",
            {"className": "col-sm"},
            commonElements.itemLabel("tags", inputId),
            commonElements.tagsInput(inputId, this.props.mediaItem.tags)
        )
    }

    /**
     * A div with textInputDivs for name, creator, rights
     *
     * @return {object}
     */
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
            this.textInputDiv("mediaUrl", this.inputChange.bind(this)),
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

    optionsRow() {
        return React.createElement(
            "div",
            {"className": "form-row mt-3"},
            this.tagsInputDiv(),
            commonElements.selectDiv(
                "format",
                config.formatName,
                this.props.mediaItem.id,
                this.props.mediaItem.format
            ),
            commonElements.selectDiv(
                "language",
                this.languageObject(),
                this.props.mediaItem.id,
                this.props.mediaItem.language
            ),
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
                "id": "form_" + this.props.mediaItem.id
            },
            this.nameRow(),
            this.fileRow(),
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

MediaFormCard.propTypes = {
    "languages": PropTypes.array.isRequired,
    "mediaItem": PropTypes.object.isRequired,
    "setActivity": PropTypes.func.isRequired,
    "saveItem": PropTypes.func.isRequired
};
