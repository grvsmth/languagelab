/**
 * Card for displaying info about a media item in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, moment, PropTypes

*/
import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class MediaCard extends React.Component {
    constructor(props) {
        super(props);

        this.checkboxClick = this.checkboxClick.bind(this);
        this.player = React.createRef();
    }

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

        return React.createElement(
            "h5",
            {"className": "card-title"},
            `${this.props.mediaItem.name} (${formatText}, ${languageText}${duration})`
        );
    }

    bySpan() {
        if (!this.props.itemUser) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-info"},
            " by ",
            this.props.itemUser.username
        );
    }

    itemSubtitle() {
        const uploadedText = new moment(this.props.mediaItem.uploaded)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-dark"},
            `${this.props.mediaItem.creator} (added ${uploadedText}`,
            this.bySpan(),
            ")"
        );
    }

    rightsSpan() {
        return React.createElement(
            "span",
            {"className": "card-text mr-2"},
            this.props.mediaItem.rights
        );
    }

    checkboxClick(event) {
        this.props.checkClick(
            "media",
            this.props.mediaItem.id,
            event.target.name,
            event.target.checked
        )
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
        return React.createElement(
            "a",
            {"className": "text-primary", "onClick": this.editClick.bind(this)},
            "edit"
        );
    }

    /**
     * A delete link
     *
     * @return {object}
     */
    deleteLink() {
        return React.createElement(
            "a",
            {
                "className": "text-danger",
                "onClick": this.deleteClick.bind(this)
            },
            "delete"
        );
    }

    playHandler() {
        this.props.selectItem(this.props.id);
    }

    afterPlay() {
        this.props.selectItem(null);
    }

    showControls() {
        if (this.props.selectedItem
            && this.props.id !== this.props.selectedItem) {
            this.player.current.pause();
            return false;
        }
        return true;
    }

    makePlayer() {
        /*

            When we re-implement file upload, we will need to pick the proper
            URL

        */
        return React.createElement(
            "audio",
            {
                "id": "audio1",
                "ref": this.player,
                "src": this.props.mediaItem.mediaUrl,
                "onEnded": this.afterPlay.bind(this),
                "onPause": this.afterPlay.bind(this),
                "onPlay": this.playHandler.bind(this),
                "controls": this.showControls(),
                "style": {
                    "width": "100%"
                }
            },
            null
        );
    }

    playerDiv() {
        return React.createElement(
            "div",
            {"className": "d-flex flex-row mt-3"},
            this.makePlayer()
        );
    }

    linkDiv() {
        if (this.props.activity === "add") {
            return null;
        }
        return React.createElement(
            "div",
            {},
            this.editLink(),
            " ",
            this.deleteLink()
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            this.itemSubtitle(),
            this.playerDiv(),
            commonElements.tagsElement(this.props.mediaItem.tags, "span"),
            this.rightsSpan(),
            this.linkDiv()
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "card border-primary bg-light mb-3"},
            this.cardBody()
        );
    }
}

MediaCard.propTypes = {
    "activity": PropTypes.string.isRequired,
    "checkClick": PropTypes.func.isRequired,
    "deleteClick": PropTypes.func.isRequired,
    "id": PropTypes.string.isRequired,
    "itemUser": PropTypes.object.isRequired,
    "languages": PropTypes.array.isRequired,
    "mediaItem": PropTypes.object.isRequired,
    "selectItem": PropTypes.func.isRequired,
    "selectedItem": PropTypes.string.isRequired
};
