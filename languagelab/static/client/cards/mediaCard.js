/**
 * Card for displaying info about a media item in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global moment

*/
import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

/**  Card for displaying info about a media item in the LanguageLab client */
export default class MediaCard {

    /**
     */
    constructor() {
    }

    /**
     * A card title, with name, format, language and duration
     *
     * @return {object}
     */
    itemTitle() {
        const formatText = config.formatName[this.props.mediaItem.format];

        var languageText = "";
        if (this.props.mediaItem.language && this.props.languages
            && this.props.languages.length > this.props.mediaItem.language) {
            const language = this.props.languages.find(
                (language) => language.id === this.props.mediaItem.language
            );
            languageText = language.name + ", ";
        }

        const durationMoment = moment.duration(this.props.mediaItem.duration)
        const duration = util.formatDuration(durationMoment, 0);

        const element = document.createElement("h5");
        element.classList.add("card-title");
        element.innerText = `${this.props.mediaItem.name} (${formatText},`
            + `${languageText}${duration})`;

        return element;
    }

    /**
     * A span crediting the uploader of the media item
     *
     * @return {object}
     */
    bySpan() {
        if (!this.props.itemUser) {
            return null;
        }

        const element = document.createElement("span");
        element.classList.add("text-info");
        element.innerText = " by " + this.props.itemUser.username;

        return element;
    }

    /**
     * Subtitle, crediting the creator and uploader
     *
     * @return {object}
     */
    itemSubtitle() {
        const uploadedText = new moment(this.props.mediaItem.uploaded)
            .format(config.dateTimeFormat);

        const element = document.createElement("h6");
        element.classList.add("card-subtitle", "text-dark");
        element.append(
            `${this.props.mediaItem.creator} (added ${uploadedText}`,
            this.bySpan(),
            ")"
        );

        return element;
    }

    /**
     * The rights declared over the media item
     *
     * @return {object}
     */
    rightsSpan() {
        const element = document.createElement("span");
        element.classList.add("card-text", "me-2");
        element.innerText = this.props.mediaItem.rights;

        return element;
    }

    /**
     * Handle clicks on the edit button by calling the selectItem() function
     * from the props with the item ID
     */
    editClick() {
        this.props.selectItem(this.props.mediaItem.id, "edit");
    }

    /**
     * Handle clicks on the delete button by calling the deleteClick() function
     * from the props with the item ID
     */
    deleteClick() {
        this.props.deleteClick("media", this.props.mediaItem.id);
    }

    /**
     * An edit link
     *
     * @return {object}
     */
    editLink() {
        const element = document.createElement("a");
        element.classList.add("text-primary");
        element.addEventListener("click", this.editClick.bind(this));
        element.innerText = "edit";

        return element;
    }

    /**
     * A delete link
     *
     * @return {object}
     */
    deleteLink() {
        const element = document.createElement("a");
        element.classList.add("text-danger");
        element.addEventListener("click", this.deleteClick.bind(this));
        element.innerText = "delete";

        return element;
    }

    /** Select this item in state if the user has pressed play */
    playHandler() {
        this.props.selectItem(this.props.id);
    }

    /** Release this item in state after playback stops */
    afterPlay() {
        this.props.selectItem(null);
    }

    /**
     * if we're playing a different item, stop playing this item and hide the
     * controls
     *
     * @return {boolean}
     */
    showControls() {
        if (this.props.selectedItem
            && this.props.id !== this.props.selectedItem) {
            this.player.current.pause();
            return false;
        }
        return true;
    }

    /**
     * A player to allow the user to preview the media item
     *
     * When we re-implement file upload, we will need to pick the proper URL
     *
     * @return {object}
     */
    makePlayer() {
        const element = document.createElement("audio");
        element.id = "audio1";
        element.src = this.props.mediaItem.mediaUrl;
        element.addEventListener("ended", this.afterPlay.bind(this));
        element.addEventListener("pause", this.afterPlay.bind(this));
        element.addEventListener("play", this.playHandler.bind(this));
        element.controls = this.showControls();
        element.style.width = "100%";

        return element;
    }

    /**
     * A row to wrap the player in
     *
     * @return {object}
     */
    playerDiv() {
        const element = document.createElement("div");
        element.classList.add("d-flex", "flex-row", "mt-3");
        element.append(this.makePlayer());

        return element;
    }

    /**
     * The edit and delete links
     *
     * @return {object}
     */
    linkDiv() {
        if (this.props.activity === "add") {
            return null;
        }
        const element = document.createElement("div");
        element.append(
            this.editLink(),
            " ",
            this.deleteLink()
        );

        return element;
    }

    /**
     * The card body, containing title, subtitle, player, tags, rights and links
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("div");
        element.classList.add("card-body");

        element.append(
            this.itemTitle(),
            this.itemSubtitle(),
            this.playerDiv(),
            commonElements.tagsElement(this.props.mediaItem.tags, "span"),
            this.rightsSpan(),
            this.linkDiv()
        );

        return element;
    }

    /**
     * The main card
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        const element = document.createElement("div");
        element.classList.add("card", "border-primary", "bg-light", "mb-3");
        element.append(this.cardBody());

        return element;
    }
}
