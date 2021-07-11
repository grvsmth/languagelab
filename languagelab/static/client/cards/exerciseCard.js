/**
 * Card for displaying info about an exercise in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, PropTypes

*/
import ExerciseCardBody from "./exerciseCardBody.js";
import QueueFooter from "./queueFooter.js";

/** Card for displaying info about an exercise in the LanguageLab client */
export default class ExerciseCard extends React.Component {

    /**
     * A card header with the exercise name
     *
     * @return {object}
     */
    cardHeader() {
        return React.createElement(
            "h5",
            {"className": "card-header"},
            this.props.exercise.name
        );
    }

    /**
     * Pass some of the props to cardBody
     *
     * @return {object}
     */
    cardBody() {
        return React.createElement(
            ExerciseCardBody,
            {
                "activity": this.props.activity,
                "canWrite": this.props.canWrite,
                "checkClick": this.props.checkClick,
                "deleteClick": this.props.deleteClick,
                "exercise": this.props.exercise,
                "itemUser": this.props.itemUser,
                "mediaItem": this.props.mediaItem,
                "queueClick": this.props.queueClick,
                "selectedType": this.props.selectedType,
                "selectItem": this.props.selectItem,
                "startExercise": this.props.startExercise
            },
            null
        );
    }

    /**
     * Pass some of the props to QueueFooter
     *
     * @return {object}
     */
    cardFooter() {
        return React.createElement(
            QueueFooter,
            {
                "canWrite": this.props.canWrite,
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

    /**
     * Slightly different formatting to distinguish an exercise card in an
     * editQueue from one in the main list
     *
     * @return {object}
     */
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
    "canWrite": PropTypes.bool.isRequired,
    "checkClick": PropTypes.func.isRequired,
    "deleteClick": PropTypes.func.isRequired,
    "exercise": PropTypes.object.isRequired,
    "itemUser": PropTypes.object.isRequired,
    "lessons": PropTypes.array.isRequired,
    "maxRank": PropTypes.func.isRequired,
    "mediaItem": PropTypes.object.isRequired,
    "queueClick": PropTypes.func.isRequired,
    "queueItem": PropTypes.object.isRequired,
    "selectItem": PropTypes.func.isRequired,
    "selectedType": PropTypes.string.isRequired,
    "startExercise": PropTypes.func.isRequired
};
