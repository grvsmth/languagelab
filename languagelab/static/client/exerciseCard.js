import config from "./config.js";
import commonElements from "./commonElements.js";

import ExerciseCardBody from "./exerciseCardBody.js";
import QueueFooter from "./queueFooter.js";
import util from "./util.js";

const timeFormat = "HH:mm:ss.S";

export default class ExerciseCard extends React.Component {
    constructor(props) {
        super(props);
    }

    queueBody(item) {
        if (!this.props.exercise.hasOwnProperty("name")) {
            return null;
        }

        return React.createElement(
            "div",
            {"className": "card-body"},
            `Loading exercise ${item.exercise}`
        );

    }

    cardHeader() {
        return React.createElement(
            "h5",
            {"className": "card-header"},
            this.props.exercise.name
        );
    }

    cardBody() {
        if (!this.props.exercise.hasOwnProperty("name")) {
            return this.queueBody(this.props.exercise);
        }

        return React.createElement(
            ExerciseCardBody,
            {
                "activity": this.props.activity,
                "checkClick": this.props.checkClick,
                "deleteClick": this.props.deleteClick,
                "exercise": this.props.exercise,
                "itemUser": this.props.itemUser,
                "languages": this.props.languages,
                "mediaItem": this.props.mediaItem,
                "queueClick": this.props.queueClick,
                "selectedType": this.props.selectedType,
                "selectItem": this.props.selectItem,
                "startExercise": this.props.startExercise
            },
            null
        );
    }

    cardFooter() {
        if (!this.props.exercise.hasOwnProperty("name")) {
            return null;
        }

        return React.createElement(
            QueueFooter,
            {
                "exerciseId": this.props.exercise.id,
                "exerciseLessons": this.props.exercise.queueItems,
                "lessons": this.props.lessons,
                "maxRank": this.props.maxRank,
                "queueItem": this.props.queueItem,
                "queueClick": this.props.queueClick
            },
            null
        );
    }

    render() {
        var className = "card bg-light";
        if (this.props.activity !== "editQueue") {
            className += " mb-3";
        };

        return React.createElement(
            "div",
            {"className": className},
            this.cardHeader(),
            this.cardBody(),
            this.cardFooter()
        );
    }
}