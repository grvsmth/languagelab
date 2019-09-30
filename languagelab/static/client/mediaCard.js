import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class MediaCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    itemTitle() {
        const formatText = config.formatName[this.props.mediaItem.format];

        var languageText = "";
        if (this.props.mediaItem.language && this.props.languages) {
            languageText = this.props.languages[0].name + ", ";
        }

        return React.createElement(
            "h5",
            {"className": "card-title"},
            `${this.props.mediaItem.name} (${formatText}, ${languageText}${this.props.mediaItem.duration})`
        );
    }

    bySpan() {
        if (!this.props.users) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-dark"},
            " by ",
            this.props.users[0].username
        );
    }

    itemSubtitle() {
        const uploadedText = new moment(this.props.mediaItem.uploaded)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-muted"},
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

    editClick(event) {
        this.props.editItem(this.props.mediaItem.id);
    }

    deleteClick(event) {
        this.props.deleteClick();
    }

    editLink() {
        return React.createElement(
            "a",
            {"className": "text-primary", "onClick": this.editClick.bind(this)},
            "edit"
        );
    }

    deleteLink() {
        return React.createElement(
            "a",
            {"className": "text-danger", "onClick": this.deleteClick.bind(this)},
            "delete"
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
            this.rightsSpan(),
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
            this.linkDiv()
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