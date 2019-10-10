import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

const timeFormat = "HH:mm:ss.S";

export default class ExerciseCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);

        this.checkboxClick = this.checkboxClick.bind(this);
        this.editClick = this.editClick.bind(this);
        this.rankButton = this.rankButton.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
    }

    duration(start, end) {
        const startMoment = new moment(start, timeFormat);
        const endMoment = new moment(end, timeFormat);
        const durationMoment = moment.duration(endMoment.diff(startMoment));
        return util.formatDuration(durationMoment, 3);
    }

    itemTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.item.name
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
        const timeRange = util.timeRange(
            this.props.item.startTime,
            this.props.item.endTime,
            timeFormat
        );

        var mediaName = "";
        if (this.props.mediaItem) {
            mediaName = this.props.mediaItem.name + ", ";

        }

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-muted"},
            mediaName,
            timeRange
        );
    }

    descriptionRow() {
        var languageText = "";
        if (this.props.languages && this.props.languages.length && this.props.languages[0]) {
            languageText = this.props.languages[0].name + ", ";
        }

        var mediaCreator = "";
        if (this.props.mediaItem) {
            mediaCreator = this.props.mediaItem.creator;
        }

        return React.createElement(
            "div",
            {},
            languageText,
            mediaCreator,
            ": ",
            this.props.item.description
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

    rankBadge(rank) {
        return React.createElement(
            "span",
            {"className": "badge badge-success"},
            rank
        );
    }

    iconSpan(iconClass) {
        return React.createElement(
            "i",
            {"className": "oi " + iconClass},
            null
        );
    }

    queueClick(event) {
        console.dir(event.target);
    }

    rankButton(buttonContent) {
        const iconClass = config.queueButton[buttonContent]["icon"];
        const btnClass = "btn-" + config.queueButton[buttonContent]["color"];
        const buttonId = [buttonContent, this.props.item.id].join("_");

        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-sm " + btnClass,
                "key": "rank-button-" + buttonContent,
                "onClick": this.queueClick,
                "id": buttonId
            },
            this.iconSpan(iconClass)
        );
    }

    rankButtonGroup() {
        return React.createElement(
            "span",
            {"className": "button-group"},
            Object.keys(config.queueButton).map(this.rankButton)
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            this.itemSubtitle(),
            this.descriptionRow(),
            this.linkDiv()
        );
    }

    cardFooter() {
        if (!this.props.queueItem) {
            return null;
        }

        return React.createElement(
            "div",
            {"className": "card-footer"},
            this.rankBadge(this.props.rank),
            " in queue ",
            this.rankButtonGroup()
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "card bg-light"},
            this.cardBody(),
            this.cardFooter()
        );
    }

}