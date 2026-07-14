/**
 * Card for displaying info about a lesson in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global moment

*/

import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class LessonCard {

    /** Call toggleLesson in the lab element, passing the lesson id */
    toggleLesson() {
        console.log("togglelesson", this.props);
        this.props.toggleLesson(this.props.lesson.id);
    }

    /**
     * A title element, with the name
     *
     * @return {object}
     */
    itemTitle() {
        const element = document.createElement("h5");
        element.classList.add("card-title");
        element.innerText = this.props.lesson.name;

        return element;
    }

    /**
     * A span crediting the creator of the item, if we have one
     *
     * @return {object}
     */
    bySpan() {
        if (!this.props.itemUser) {
            return "";
        }

        const element = document.createElement("span");
        element.classList.add("text-info");
        element.innerText = this.props.itemUser.username;

        return element;
    }

    /**
     * A subtitle with the lesson description, level and created time and credit
     *
     * @return {object}
     */
    itemSubtitle() {
        const createdText = new moment(this.props.lesson.created)
            .format(config.dateTimeFormat);

        const element = document.createElement("h6");
        element.classList.add("card-subtitle", "text-dark");
        element.append(
            `${this.props.lesson.description} (level ${this.props.lesson.level},
              created ${createdText} by `,
            this.bySpan(),
            ")"
        );

        return element;
    }

    /**
     * Handle clicks on the edit button by calling the selectItem() function
     * from the props with the ID of the lesson
     */
    editClick() {
        this.props.selectItem(this.props.lesson.id, "edit");
    }

    /**
     * Handle clicks on the delete button by calling the deleteClick() function
     * from the props with the item ID
     */
    deleteClick() {
        this.props.deleteClick("lessons", this.props.lesson.id);
    }

    /**
     * An edit link
     *
     * @return {object}
     */
    editLink() {
        const element = document.createElement("a");
        element.classList.add("text-primary");
        element.addEventListener("click", this.editClick.bind(this));
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
     * The edit and delete links
     *
     * @return {object}
     */
    linkDiv() {
        if (this.props.activity === "add") {
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
     * A div for lesson notes
     *
     * @return {object}
     */
    notesDiv() {
        const element = document.createElement("div");
        element.innerText = this.props.lesson.notes;

        return element;
    }

    /**
     * A button to toggle doing the lesson
     *
     * @return {object}
     */
    doQueueButton(disabled=false) {
        const actionInfo = this.props.selected ? "End lesson": "Start lesson";
        const colorClass = this.props.selected ? "btn-secondary" : "btn-info";

        const element = document.createElement("button");
        element.type = "button";

        element.classList.add(
            "btn",
            "btn-sm",
            "ms-2",
            colorClass
        );

        element.disabled = disabled;
        element.addEventListener("click", this.toggleLesson.bind(this));

        element.innerText = actionInfo;

        return element;
    }

    /** Set the editQueue activity in lab state */
    editQueue() {
        this.props.setActivity("editQueue", null, this.props.lesson.id);
    }

    /**
     * A button allowing the user to edit the queue
     *
     * @return {object}
     */
    editQueueButton(disabled=false) {
        if (!this.props.canWrite) {
            return "";
        }

        const element = document.createElement("button");

        element.classList.add("btn", "btn-sm", "btn-primary", "ms-2");
        element.addEventListener("click", this.editQueue.bind(this));

        element.disabled = disabled;
        element.type = "button";

        element.innerText = "Edit queue";
        return element;
    }

    /**
     * A div with the number of exercises and the buttons to edit and start
     * the lesson queue.  If we don't have queueItems or exercises, disable
     * these buttons.
     *
     * @return {object}
     */
    queueDiv() {
        const disabled = this.props.lesson.queueItems.length < 1
            || this.props.exercisesLoading;

        const element = document.createElement("div");
        element.classList.add("pt-1");

        element.append(
            util.howManyExercises(this.props.lesson.queueItems),
            this.editQueueButton(disabled),
            this.doQueueButton(disabled)
        );

        return element;
    }

    /**
     * The cardBody, with title, subtitle, notes, tags, links and queue buttons
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("div");
        element.classList.add("card-body");

        element.append(
            this.itemTitle(),
            this.itemSubtitle(),
            this.notesDiv(),
            commonElements.tagsElement(this.props.lesson.tags, "div"),
            this.linkDiv(),
            this.queueDiv()
        );

        return element;
    }

    /**
     * The render function, with a card
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        const element = document.createElement("div");
        element.classList.add("card", "border-secondary", "bg-light", "mb-3");

        element.append(this.cardBody());

        return element;
    }
}
