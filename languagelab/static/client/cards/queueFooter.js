/**
 * Card footer component for adding or ranking an exercise in a lesson queue,
 * in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

/** Card footer component for adding or ranking an exercise in a lesson queue */
export default class QueueFooter {

    /**
     * A badge to indicate the rank of an item in the queue
     *
     * @return {object}
     */
    rankBadge() {
        const element = document.createElement("span");
        element.classList.add("badge", "badge-success");
        element.innerText = this.props.queueItem.rank;

        return element;
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
        const element = document.createElement("button");
        element.type = "button";

        element.classList.add("btn");
        element.classList.add(
            "btn-" + config.queueButton[buttonContent]["color"]
        );

        element.disabled = this.isRankButtonDisabled(buttonContent);
        element.Id = [buttonContent, this.props.queueItem.id].join("_");
        element.addEventListener("click", this.queueClick.bind(this));

        element.append(
            commonElements.iconSpan(config.queueButton[buttonContent]["icon"])
        );

        return element;
    }

    /**
     * A span to wrap the rank badge
     *
     * @return {object}
     */
    badgeSpan() {
        const element = document.createElement("span");
        element.append(this.rankBadge(), " in queue ");

        return element;
    }

    /**
     * A button to add the exercise to the selected lesson
     *
     * @return {object}
     */
    addButton() {
        const element = document.createElement("button");
        element.type = "button";
        element.classList.add("btn", "btn-success", "btn-sm", "ms-2");
        element.id = "add";
        element.addEventListener("click", this.addClick.bind(this));
        element.innerText = "Add to lesson";

        return element;
    }

    /**
     * Determine the ID of the first lesson in the list
     *
     * @return {number}
     */
    firstLesson() {
        if (!this.props.exerciseLessons || !this.props.exerciseLessons.length) {
            return "";
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

        const element = document.createElement("span");
        element.classList.add("d-inline-block");

        element.append(
            commonElements.itemSelect(
                "lesson",
                util.listToObject(this.props.lessons),
                inputId,
                this.firstLesson()
            )
        );

        return element;
    }

    /**
     * A footer containing the message that there are no lessons available
     *
     * @return {object}
     */
    lessonMessage() {
        const element = document.createElement("div");
        element.classList.add("card-footer");
        element.innerText = config.message.lessonQueue;

        return element;
    }

    /**
     * A span telling the user how many lessons an exercise is already in
     *
     * @return {object}
     */
    exerciseLessons() {
        if (!this.props.exerciseLessons) {
            return "";
        }

        const element = document.createElement("span");
        element.classList.add("me-2");
        element.innerText = `In ${this.props.exerciseLessons.length} lessons`;

        return element;
    }

    /**
     * A footer allowing the user to add the exercise to lessons
     *
     * @return {object}
     */
    addFooter() {
        if (!this.props.canWrite) {
            return "";
        }

        if (!this.props.lessons || !this.props.lessons.length) {
            return this.lessonMessage();
        }

        const element = document.createElement("div");
        element.classList.add("card-footer"},

        element.append(
            this.exerciseLessons(),
            this.lessonSpan(),
            this.addButton(),
        );

        return element;
    }

    /**
     * A button group with the queue buttons (up, down, remove)
     *
     * @return {object}
     */
    rankButtonGroup() {
        const element = document.createElement("div");
        element.classList.add("btn-group", "btn-group-sm");
        element.role = "group";
        element.append(
            ...Object.keys(config.queueButton).map(this.rankButton, this)
        );

        return element;
    }

    /**
     * If we're editing the queue order, return the ranking footer; otherwise
     * the add footer
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        if (!this.props.queueItem) {
            return this.addFooter();
        }

        const element = document.createElement("div");
        element.classList.add("card-footer");

        element.append(this.badgeSpan(), this.rankButtonGroup());

        return element;
    }
}
