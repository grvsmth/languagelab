/**
 * Card footer component for adding or ranking an exercise in a lesson queue,
 * in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, PropTypes

*/
import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

/** Card footer component for adding or ranking an exercise in a lesson queue */
export default class QueueFooter extends React.Component {

    /**
     * A badge to indicate the rank of an item in the queue
     *
     * @return {object}
     */
    rankBadge() {
        return React.createElement(
            "span",
            {"className": "badge badge-success"},
            this.props.queueItem.rank
        );
    }

    /**
     * Determine the input selector ID, retrieve the selected lesson and send it
     * to this.props.queueClick()
     */
    addClick() {
        const inputSelector = ["#lesson", this.props.exerciseId].join("_");
        const lessonId = parseInt(document.querySelector(inputSelector).value);

        this.props.queueClick("add", this.props.exerciseId, lessonId);
    }

    /**
     * Retrieve the desired action from the button ID and pass that to
     * this.props.queueClick()
     *
     * @param {object} event
     */
    queueClick(event) {
        const idParts = event.currentTarget.id.split("_");
        if (!idParts) {
            return;
        }

        this.props.queueClick(idParts[0], this.props.queueItem.id);
    }

    /**
     * Disable the up and down ranking buttons if we can't move the exercise
     * any further up or down
     *
     * @param {string} buttonContent - the action specified by the button
     *
     * @return {boolean}
     */
    isRankButtonDisabled(buttonContent) {
        if (buttonContent === "up" && this.props.queueItem.rank <= 1) {
            return true;
        }

        if (buttonContent === "down"
            && this.props.queueItem.rank >= this.props.maxRank) {
            return true;
        }

        return false;
    }

    /**
     * A button element for reranking exercises in a lesson queue
     *
     * @param {string} buttonContent - the action specified by the button
     *
     * @return {object}
     */
    rankButton(buttonContent) {
        const disabled = this.isRankButtonDisabled(buttonContent);

        const iconClass = config.queueButton[buttonContent]["icon"];
        const btnClass = "btn-" + config.queueButton[buttonContent]["color"];
        const buttonId = [buttonContent, this.props.queueItem.id].join("_");

        return React.createElement(
            "button",
            {
                "className": "btn " + btnClass,
                "disabled": disabled,
                "id": buttonId,
                "key": "rank-button-" + buttonContent,
                "onClick": this.queueClick.bind(this),
                "type": "button"
            },
            commonElements.iconSpan(iconClass)
        );
    }

    /**
     * A span to wrap the rank badge
     *
     * @return {object}
     */
    badgeSpan() {
        return React.createElement(
            "span",
            {},
            this.rankBadge(),
            " in queue "
        );
    }

    /**
     * A button to add the exercise to the selected lesson
     *
     * @return {object}
     */
    addButton() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-success btn-sm ml-2",
                "id": "add",
                "onClick": this.addClick.bind(this)
            },
            "Add to lesson",
        );
    }

    /**
     * Determine the ID of the first lesson in the list
     *
     * @return {number}
     */
    firstLesson() {
        if (!this.props.exerciseLessons || !this.props.exerciseLessons.length) {
            return null;
        }

        return this.props.exerciseLessons[0].lesson;
    }

    /**
     * A span containing the lesson selector
     *
     * @return {object}
     */
    lessonSpan() {
        const inputId = ["lesson", this.props.exerciseId].join("_");

        return React.createElement(
            "span",
            {"className": "d-inline-block"},
            commonElements.itemSelect(
                "lesson",
                util.listToObject(this.props.lessons),
                inputId,
                this.firstLesson()
            )
        );
    }

    /**
     * A footer containing the message that there are no lessons available
     *
     * @return {object}
     */
    lessonMessage() {
        return React.createElement(
            "div",
            {"className": "card-footer"},
            config.message.lessonQueue
        )
    }

    /**
     * A span telling the user how many lessons an exercise is already in
     *
     * @return {object}
     */
    exerciseLessons() {
        if (!this.props.exerciseLessons) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "mr-2"},
            `In ${this.props.exerciseLessons.length} lessons`
        );
    }

    /**
     * A footer allowing the user to add the exercise to lessons
     *
     * @return {object}
     */
    addFooter() {
        if (!this.props.canWrite) {
            return null;
        }

        if (!this.props.lessons || !this.props.lessons.length) {
            return this.lessonMessage();
        }

        return React.createElement(
            "div",
            {"className": "card-footer"},
            this.exerciseLessons(),
            this.lessonSpan(),
            this.addButton(),
        );
    }

    /**
     * A button group with the queue buttons (up, down, remove)
     *
     * @return {object}
     */
    rankButtonGroup() {
        return React.createElement(
            "div",
            {
                "className": "btn-group btn-group-sm",
                "role": "group"
            },
            Object.keys(config.queueButton).map(this.rankButton, this)
        );
    }

    /**
     * If we're editing the queue order, return the ranking footer; otherwise
     * the add footer
     *
     * @return {object}
     */
    render() {
        if (!this.props.queueItem) {
            return this.addFooter();
        }

        return React.createElement(
            "div",
            {"className": "card-footer"},
            this.badgeSpan(),
            this.rankButtonGroup()
        );
    }
}

QueueFooter.propTypes = {
    "canWrite": PropTypes.bool.isRequired,
    "exerciseClick": PropTypes.func.isRequired,
    "exerciseId": PropTypes.string.isRequired,
    "exerciseLessons": PropTypes.array.isRequired,
    "lessons": PropTypes.array.isRequired,
    "maxRank": PropTypes.func.isRequired,
    "queueClick": PropTypes.func.isRequired,
    "queueItem": PropTypes.object.isRequired
};
