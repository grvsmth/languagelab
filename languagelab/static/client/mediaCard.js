import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class MediaCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);

        this.checkboxClick = this.checkboxClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.editClick = this.editClick.bind(this);
    }

    itemTitle() {
        const formatText = config.formatName[this.props.item.format];

        var languageText = "";
        if (this.props.item.language && this.props.languages
            && this.props.languages.length && this.props.languages[0]) {
            languageText = this.props.languages[0].name + ", ";
        }

        const durationMoment = moment.duration(this.props.item.duration)
        const duration = util.formatDuration(durationMoment, 0);

        return React.createElement(
            "h5",
            {"className": "card-title"},
            `${this.props.item.name} (${formatText}, ${languageText}${duration})`
        );
    }

    bySpan() {
        if (!this.props.users) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-info"},
            " by ",
            this.props.users[0].username
        );
    }

    itemSubtitle() {
        const uploadedText = new moment(this.props.item.uploaded)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-dark"},
            `${this.props.item.creator} (added ${uploadedText}`,
            this.bySpan(),
            ")"
        );
    }

    rightsSpan() {
        return React.createElement(
            "span",
            {"className": "card-text mr-2"},
            this.props.item.rights
        );
    }

    checkboxClick(event) {
        this.props.checkClick(
            "media",
            this.props.item.id,
            event.target.name,
            event.target.checked
        )
    }

    editClick(event) {
        this.props.editItem(this.props.item.id);
    }

    deleteClick(event) {
        this.props.deleteClick("media", this.props.item.id);
    }

    editLink() {
        return React.createElement(
            "a",
            {"className": "text-primary", "onClick": this.editClick},
            "edit"
        );
    }

    deleteLink() {
        return React.createElement(
            "a",
            {"className": "text-danger", "onClick": this.deleteClick},
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
        if (this.props.item.tags.length < 1) {
            return null;
        }

        return React.createElement(
            "span",
            {},
            ...this.props.item.tags.map((tag) => {
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
                this.props.item.isAvailable,
                "available",
                this.props.item.id,
                this.checkboxClick
                ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.item.isPublic,
                "public",
                this.props.item.id,
                this.checkboxClick
                ),
            this.linkDiv()
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "card bg-secondary"},
            this.cardBody()
        );
    }

}