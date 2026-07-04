/**
 * Card body for displaying info about an exercise in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

import util from "./util.js";

const timeFormat = "HH:mm:ss.S";

/** Card body for displaying info about an exercise in the LanguageLab client */
export default class ExerciseCardBody {

    /**
     * Bind the start click handler
     *
     * @param {props}
     */
    constructor(props) {
        this.startClick = this.startClick.bind(this);
    }

    /**
     * A span crediting the exercise creator
     *
     * @return {object}
     */
    bySpan() {
        if (!this.props.itemUser) {
            return "";
        }

        const element = document.createElement("span");
        element.classList.add("text-dark");
        element.innerText = " by " + this.props.itemUser.username;

        return element;
    }

    /**
     * A subtitle with the media name and time range
     *
     * @return {object}
     */
    itemSubtitle() {
        const timeRange = util.timeRange(
            this.props.exercise.startTime,
            this.props.exercise.endTime,
            timeFormat
        );

        let mediaName = "";
        if (this.props.mediaItem) {
            mediaName = this.props.mediaItem.name + ", ";

        }

        const element = document.createElement("h6");
        element.classList.add("card-subtitle text-muted");
        element.innerText = mediaName + timeRange;

        return element;
    }

    /**
     * A row with language, media creator and description
     *
     * @return {object}
     */
    descriptionRow() {
        let mediaCreator = "";
        if (this.props.mediaItem) {
            mediaCreator = this.props.mediaItem.creator;
        }

        const element = document.createElement("div");
        element.innerText = mediaCreator + " – "
            + this.props.exercise.description;

        return element;
    }

    /**
     * Handle clicks on the edit button by calling the selectItem() function
     * from the props with the item ID
     */
    editClick() {
        this.props.selectItem(this.props.exercise.id, "edit");
    }

    /**
     * Handle clicks on the delete button by calling the deleteClick() function
     * from the props with the item ID
     */
    deleteClick() {
        this.props.deleteClick("exercises", this.props.exercise.id);
    }

    /**
     * Handle clicks on the start button by calling the startClick() function
     * from the props with the item ID
     */
    startClick() {
        this.props.startExercise(this.props.exercise.id);
    }

    /**
     * An edit link
     *
     * @return {object}
     */
    editLink() {
        const element = document.createElement("a");
        element.classList.add("text-primary");
        element.addEventListener(this.editClick.bind(this));
        element.innerText = "edit";

        return element;
    }

    /**
     * A delete link
     *
     * @return {object}
     */
    deleteLink() {
        const element = document.createElement("a");
        element.classList.add("text-danger");
        element.addEventListener("click", this.deleteClick.bind(this));
        element.innerText = "delete";

        return element;
    }

    /**
     * Edit and delete links; don't show if we're editing the queue
     *
     * @return {object}
     */
    linkDiv() {
        if (this.props.activity === "add"
            || this.props.selectedType === "queueItems") {
            return "";
        }

        if (this.props.activity === "editQueue") {
            return "";
        }

        if (!this.props.canWrite) {
            return "";
        }

        const element = document.createElement("div");
        element.append(
            this.editLink(),
            " ",
            this.deleteLink()
        );

        return element;
    }

    /**
     * A button to start the exercise, not displayed if we're editing the queue
     *
     * @return {object}
     */
    startButton() {
        if (this.props.activity === "editQueue") {
            return "";
        }
        const element = document.createElement("button");
        element.classList.add("btn", "btn-success");
        element.type = "button",
        element.id = "start_" + this.props.exercise.id;
        element.addEventListener("click", this.startClick);
        element.innerText = "Start exercise";

        return element;
    }

    /**
     * A div to wrap the start button
     *
     * @return {object}
     */
    startDiv() {
        const element = document.createElement("div");
        element.append(this.startButton());

        return element;
    }

    /**
     * A card body, with subtitle, description, links and start button
     *
     * @return {object}
     */
    render() {
        const element = document.createElement("div");
        element.classList.add("card-body");

        element.append(
            this.itemSubtitle(),
            this.descriptionRow(),
            this.linkDiv(),
            this.startDiv()
        );

        return element;
    }
}
