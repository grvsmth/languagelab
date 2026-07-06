/**
 * Card for displaying info about an exercise in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

import ExerciseCardBody from "./exerciseCardBody.js";
import QueueFooter from "./queueFooter.js";

/** Card for displaying info about an exercise in the LanguageLab client */
export default class ExerciseCard {

    /**
     * A card header with the exercise name
     *
     * @return {object}
     */
    cardHeader() {
        const element = document.createElement("h5");
        element.classList.add("card-header");
        element.innerText = this.props.exercise.name;

        return element;
    }

    /**
     * Pass some of the props to cardBody
     *
     * @return {object}
     */
    cardBody() {
        const element = new ExerciseCardBody();
        return element.render({
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
        });
    }

    /**
     * Pass some of the props to QueueFooter
     *
     * @return {object}
     */
    cardFooter() {
        const element = new QueueFooter();

        return element.render({
            "canWrite": this.props.canWrite,
            "exerciseId": this.props.exercise.id,
            "exerciseLessons": this.props.exercise.queueItems,
            "lessons": this.props.lessons,
            "maxRank": this.props.maxRank,
            "queueItem": this.props.queueItem,
            "queueClick": this.props.queueClick
        });
    }

    /**
     * Slightly different formatting to distinguish an exercise card in an
     * editQueue from one in the main list
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        const element = document.createElement("div");
        element.classList.add("card", "bg-light");

        if (this.props.activity !== "editQueue") {
            element.classList.add("mb-3");
        }

        element.append(
            this.cardHeader(),
            this.cardBody(),
            this.cardFooter()
        );

        return element;
    }
}
