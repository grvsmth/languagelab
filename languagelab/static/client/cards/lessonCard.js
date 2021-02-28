/**
 * Card for displaying info about a lesson in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, moment, PropTypes

*/
import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class LessonCard extends React.Component {

    /** Call toggleLesson in the lab element, passing the lesson id */
    toggleLesson() {
        this.props.toggleLesson(this.props.lesson.id);
    }

    /**
     * A title element, with the name
     *
     * @return {object}
     */
    itemTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.lesson.name
        );
    }

    /**
     * A span crediting the creator of the item, if we have one
     *
     * @return {object}
     */
    bySpan() {
        if (!this.props.itemUser) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-info"},
            this.props.itemUser.username
        );
    }

    /**
     * A subtitle with the lesson description, level and created time and credit
     *
     * @return {object}
     */
    itemSubtitle() {
        const createdText = new moment(this.props.lesson.created)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-dark"},
            `${this.props.lesson.description} (level ${this.props.lesson.level},
              created ${createdText} by `,
            this.bySpan(),
            ")"
        );
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
        return React.createElement(
            "a",
            {"className": "text-primary", "onClick": this.editClick.bind(this)},
            "edit"
        );
    }

    /**
     * A delete link
     *
     * @return {object}
     */
    deleteLink() {
        return React.createElement(
            "a",
            {
                "className": "text-danger",
                "onClick": this.deleteClick.bind(this)
            },
            "delete"
        );
    }

    linkDiv() {
        if (this.props.activity === "add") {
            return null;
        }
        return React.createElement(
            "div",
            {},
            this.editLink(),
            " ",
            this.deleteLink()
        );
    }

    notesDiv() {
        return React.createElement(
            "div",
            {},
            this.props.lesson.notes
        );
    }

    doQueueButton() {
        if (this.props.lesson.queueItems.length < 1) {
            return null;
        }

        const btnClass = this.props.selected ? "btn-secondary" : "btn-info";
        const actionInfo = this.props.selected ? "End lesson": "Start lesson";
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn " + btnClass + " btn-sm ml-2",
                "onClick": this.toggleLesson.bind(this)
            },
            actionInfo
        );
    }

    editQueue() {
        this.props.setActivity("editQueue", null, this.props.lesson.id);
    }

    editQueueButton() {
        if (!this.props.lesson.queueItems.length) {
            return null;
        }

        return React.createElement(
            "div",
            {
                "className": "btn btn-sm btn-primary ml-2",
                "onClick": this.editQueue.bind(this)
            },
            "Edit queue"
        );
    }

    queueDiv() {
        return React.createElement(
            "div",
            {},
            util.howManyExercises(this.props.lesson.queueItems),
            this.editQueueButton(),
            this.doQueueButton()
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            this.itemSubtitle(),
            this.notesDiv(),
            commonElements.tagsElement(this.props.lesson.tags, "div"),
            this.linkDiv(),
            this.queueDiv()
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "card border-secondary bg-light mb-3"},
            this.cardBody()
        );
    }
}

LessonCard.propTypes = {
    "activity": PropTypes.string.isRequired,
    "checkClick": PropTypes.func.isRequired,
    "deleteClick": PropTypes.func.isRequired,
    "itemUser": PropTypes.object.isRequired,
    "lesson": PropTypes.object.isRequired,
    "selected": PropTypes.bool.isRequired,
    "selectItem": PropTypes.func.isRequired,
    "setActivity": PropTypes.func.isRequired,
    "toggleLesson": PropTypes.func.isRequired
};
