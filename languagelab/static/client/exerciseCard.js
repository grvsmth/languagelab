import config from "./config.js";
import commonElements from "./commonElements.js";

import ExerciseCardBody from "./exerciseCardBody.js";
import QueueFooter from "./queueFooter.js";
import util from "./util.js";

const timeFormat = "HH:mm:ss.S";

export default class ExerciseCard extends React.Component {
    constructor(props) {
        super(props);

        this.checkboxClick = this.checkboxClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.editClick = this.editClick.bind(this);
        this.startClick = this.startClick.bind(this);
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
            event.currentTarget.name,
            event.currentTarget.checked
        )
    }

    editClick(event) {
        this.props.editItem(this.props.item.id);
    }

    deleteClick(event) {
        this.props.deleteClick("media", this.props.item.id);
    }

    startClick(event) {
        if (this.props.selectedType === "queueItems") {
            this.props.startExercise(this.props.queueItem.id)
        } else {
            this.props.startExercise(this.props.item.id);
        }
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

    queueBody(item) {
        if (!this.props.item.hasOwnProperty("name")) {
            return null;
        }

        return React.createElement(
            "div",
            {"className": "card-body"},
            `Loading exercise ${item.exercise}`
        );

    }

    startButton() {
        return React.createElement(
            "button",
            {
                "className": "btn btn-success",
                "type": "button",
                "id": "start_" + this.props.item.id,
                "onClick": this.startClick
            },
            "Start exercise"
        );
    }

    startDiv() {
        return React.createElement(
            "div",
            {},
            this.startButton()
        );
    }

    cardBody() {
        if (!this.props.item.hasOwnProperty("name")) {
            return this.queueBody(this.props.item);
        }

        return React.createElement(
            ExerciseCardBody,
            {
                "checkClick": this.props.checkClick,
                "editItem": this.props.editItem,
                "exercise": this.props.item,
                "languages": this.props.languages,
                "mediaItem": this.props.mediaItem,
                "queueClick": this.props.queueClick,
                "startExercise": this.props.startExercise,
                "users": this.props.users
            },
            null
        );
    }

    cardFooter() {
        if (!this.props.item.hasOwnProperty("name")) {
            return null;
        }

        return React.createElement(
            QueueFooter,
            {
                "exerciseId": this.props.item.id,
                "queueItem": this.props.queueItem,
                "queueClick": this.props.queueClick
            },
            null
        );
    }

    render() {
        console.log("props", this.props);
        return React.createElement(
            "div",
            {"className": "card bg-light"},
            this.cardBody(),
            this.cardFooter()
        );
    }
}