/**
 * Form for adding and editing media in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global moment

*/
import config from "./config.js";

import util from "./util.js";
import commonElements from "./commonElements.js";

/** Form for adding and editing media in the LanguageLab client */
export default class MediaFormCard {

    /**
     */
    constructor(props) {
        this.audio = null;
    }

    /**
     * Handle the input of an audioUrl so that we can auto-populate the duration
     *
     * @param {object} event
     */
    inputChange(event) {
        this.audio.src = event.target.value;
    }

    /**
     * Handle a click on the cancel button with a call to the setActivity() prop
     */
    cancelClick() {
        this.props.setActivity("read");
    }

    /**
     * Once we've loaded the metadata for the remote audio, we can get the
     * duration
     *
     * @param {object} event
     */
    loadedMetadata(event) {
        const durationMoment = moment.duration(event.target.duration * 1000);

        const durationInputSelector = [
            "#duration",
            this.props.mediaItem.id
            ].join("_");

        const durationInput = document.querySelector(durationInputSelector);
        durationInput.value = util.formatDuration(durationMoment);
    }

    /**
     * Audio element, only used for retrieving the duration
     *
     * return {object}
     */
    audioElement() {
        const audio = document.createElement("audio");
        audio.id = "audio1";
        audio.addEventListener(
            "loadedmetadata", this.loadedMetadata.bind(this)
        );

        this.audio = audio;
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

        let itemId = null;
        if (typeof this.props.mediaItem.id === "number") {
            itemId = this.props.mediaItem.id;
        }

        this.props.saveItem(formData, "media", itemId);
    }

    /**
     * Call the .reportValidity() method on the form
     *
     */
    reportValidity() {
        document.querySelector("#form_" + this.props.mediaItem.id)
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
        const inputId = "tags_" + this.props.mediaItem.id;

        const element = document.createElement("div");
        element.classList.add("col-sm");

        element.append(
            commonElements.itemLabel("tags", inputId),
            commonElements.tagsInput(inputId, this.props.mediaItem.tags)
        )

        return element;
    }

    /**
     * A div with textInputDivs for name, creator, rights
     *
     * @return {object}
     */
    nameRow() {
        const element = document.createElement("div");
        element.classList.add("form-row", "mt-3");

        element.append(
            this.textInputDiv("name", null, "", this.reportValidity.bind(this)),
            this.textInputDiv("creator"),
            this.textInputDiv("rights")
        );

        return element;
    }

    /**
     * A div with inputs for the media and duration; also holds the audio
     * element
     *
     * @return {object}
     */
    fileRow() {
        const element = document.createElement("div");
        element.classList.add("form-row", "mt-3");

        element.append(
            this.textInputDiv(
                "mediaUrl",
                this.inputChange.bind(this),
                "",
                this.reportValidity.bind(this)
            ),
            this.textInputDiv("duration", null, "00:00:00"),
            this.audioElement()
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
        element.append(this.saveButton(), this.cancelButton());

        return element;
    }

    /**
     * Div with format, language
     *
     * @return {object}
     */
    optionsRow() {
        const element = document.createElement("div");
        element.classList.add("form-row", "mt-3");

        element.append(
            this.tagsInputDiv(),
            commonElements.selectDiv(
                "format",
                config.formatName,
                this.props.mediaItem.id,
                this.props.mediaItem.format
            ),
            commonElements.selectDiv(
                "language",
                util.listToObject(this.props.languages),
                this.props.mediaItem.id,
                this.props.mediaItem.language
            )
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
        element.id = "form_" + this.props.mediaItem.id;

        element.append(
            this.nameRow(),
            this.fileRow(),
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
