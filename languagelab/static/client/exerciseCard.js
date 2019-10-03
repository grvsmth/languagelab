import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class ExerciseCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    duration(start, end) {
        const startMoment = new moment(start);
        const endMoment = new moment(end);
        const durationMoment = moment.duration(startMoment.diff(endMoment));

        return util.formatDuration(durationMoment, 0);
    }

    itemTitle() {
        const formatText = config.formatName[this.props.mediaItem.format];

        var languageText = "";
        if (this.props.languages && this.props.languages.length) {
            languageText = this.props.languages[0].name + ", ";
        }
        const duration = this.duration(
            this.props.item.start, this.props.item.end
        );
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
            {"className": "text-dark"},
            " by ",
            this.props.users[0].username
        );
    }

    itemSubtitle() {
        const createdText = new moment(this.props.item.created)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-muted"},
            this.props.mediaItem.name,
            ` (${this.props.mediaItem.creator}, added ${createdText}`,
            this.bySpan(),
            ")"
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

    textDiv(fieldName, options={}) {
        return React.createElement(
            "div",
            options,
            this.props.item[fieldName]
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            this.itemSubtitle(),
            this.textDiv("description"),
            commonElements.checkboxDiv(
                "isAvailable",
                this.props.item.isAvailable,
                "available",
                this.props.item.id,
                this.checkboxClick.bind(this)
                ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.item.isPublic,
                "public",
                this.props.item.id,
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