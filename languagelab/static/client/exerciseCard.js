import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class ExerciseCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    itemTitle() {
        const formatText = config.formatName[this.props.mediaItem.format];

        var languageText = "";
        if (this.props.mediaItem.language && this.props.languages
            && this.props.languages.length) {
            languageText = this.props.languages[0].name + ", ";
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
        this.props.deleteClick("media", this.props.mediaItem.id);
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

    tagBadge(tagText) {
        return React.createElement(
            "span",
            {"className": "badge badge-pill badge-info mr-1"},
            tagText
        );
    }

    tagsSpan() {
        if (this.props.mediaItem.tags.length < 1) {
            return null;
        }

        return React.createElement(
            "span",
            {},
            ...this.props.mediaItem.tags.map((tag) => {
                return this.tagBadge(tag);
            })
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
            this.tagsSpan(),
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
            JSON.stringify(this.props.item);
        );
    }

}