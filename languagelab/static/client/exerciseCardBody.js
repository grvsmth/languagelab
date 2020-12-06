import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

const timeFormat = "HH:mm:ss.S";

export default class ExerciseCardBody extends React.Component {
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

    bySpan() {
        if (!this.props.itemUser) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-dark"},
            " by ",
            this.props.itemUser.username
        );
    }

    itemSubtitle() {
        const timeRange = util.timeRange(
            this.props.exercise.startTime,
            this.props.exercise.endTime,
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
            " – ",
            this.props.exercise.description
        );
    }

    checkboxClick(event) {
        this.props.checkClick(
            "media",
            this.props.exercise.id,
            event.currentTarget.name,
            event.currentTarget.checked
        )
    }

    editClick(event) {
        this.props.editItem(this.props.exercise.id);
    }

    deleteClick(event) {
        this.props.deleteClick("exercises", this.props.exercise.id);
    }

    startClick(event) {
        this.props.startExercise(this.props.exercise.id);
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
        if (this.props.activity === "add"
            || this.props.selectedType === "queueItems") {
            return null;
        }
        return React.createElement(
            "div",
            {},
            commonElements.checkboxDiv(
                "isAvailable",
                this.props.exercise.isAvailable,
                "available",
                this.props.exercise.id,
                this.checkboxClick
                ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.exercise.isPublic,
                "public",
                this.props.exercise.id,
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

    startButton() {
        return React.createElement(
            "button",
            {
                "className": "btn btn-success",
                "type": "button",
                "id": "start_" + this.props.exercise.id,
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

    render() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemSubtitle(),
            this.descriptionRow(),
            this.linkDiv(),
            this.startDiv()
        );
    }
}