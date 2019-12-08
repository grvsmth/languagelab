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
                "checkClick": this.props.checkClick,
                "deleteClick": this.props.deleteClick,
                "editItem": this.props.editItem,
                "exercise": this.props.exercise,
                "languages": this.props.languages,
                "mediaItem": this.props.mediaItem,
                "queueClick": this.props.queueClick,
                "selectedType": this.props.selectedType,
                "startExercise": this.props.startExercise,
                "users": this.props.users
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
                "maxRank": this.props.maxRank,
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
            {"className": "card bg-light mb-3"},
            this.cardHeader(),
            this.cardBody(),
            this.cardFooter()
        );
    }
}