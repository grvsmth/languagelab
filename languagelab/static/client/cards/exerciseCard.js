/*

    global React, PropTypes

*/
import ExerciseCardBody from "./exerciseCardBody.js";
import QueueFooter from "./queueFooter.js";

export default class ExerciseCard extends React.Component {
    constructor(props) {
        super(props);
    }

    cardHeader() {
        return React.createElement(
            "h5",
            {"className": "card-header"},
            this.props.exercise.name
        );
    }

    cardBody() {
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
        }

        return React.createElement(
            "div",
            {"className": className},
            this.cardHeader(),
            this.cardBody(),
            this.cardFooter()
        );
    }
}

ExerciseCard.propTypes = {
    "activity": PropTypes.string.isRequired,
    "checkClick": PropTypes.func.isRequired,
    "deleteClick": PropTypes.func.isRequired,
    "exercise": PropTypes.object.isRequired,
    "itemUser": PropTypes.object.isRequired,
    "languages": PropTypes.array.isRequired,
    "lessons": PropTypes.array.isRequired,
    "maxRank": PropTypes.func.isRequired,
    "mediaItem": PropTypes.object.isRequired,
    "queueClick": PropTypes.func.isRequired,
    "queueItem": PropTypes.object.isRequired,
    "selectItem": PropTypes.func.isRequired,
    "selectedType": PropTypes.string.isRequired,
    "startExercise": PropTypes.func.isRequired
};
