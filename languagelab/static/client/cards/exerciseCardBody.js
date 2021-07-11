/**
 * Card body for displaying info about an exercise in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */
/*

    global React, PropTypes

*/
import util from "./util.js";

const timeFormat = "HH:mm:ss.S";

/** Card body for displaying info about an exercise in the LanguageLab client */
export default class ExerciseCardBody extends React.Component {

    /**
     * Bind the start click handler
     *
     * @param {props}
     */
    constructor(props) {
        super(props);

        this.startClick = this.startClick.bind(this);
    }

    /**
     * A span crediting the exercise creator
     *
     * @return {object}
     */
    bySpan() {
        if (!this.props.itemUser) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-dark"},
            " by ",
            this.props.itemUser.username
        );
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

        var mediaName = "";
        if (this.props.mediaItem) {
            mediaName = this.props.mediaItem.name + ", ";

        }

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-muted"},
            mediaName,
            timeRange
        );
    }

    /**
     * A row with language, media creator and description
     *
     * @return {object}
     */
    descriptionRow() {
        var mediaCreator = "";
        if (this.props.mediaItem) {
            mediaCreator = this.props.mediaItem.creator;
        }

        return React.createElement(
            "div",
            {},
            mediaCreator,
            " – ",
            this.props.exercise.description
        );
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

    /**
     * Edit and delete links; don't show if we're editing the queue
     *
     * @return {object}
     */
    linkDiv() {
        if (this.props.activity === "add"
            || this.props.selectedType === "queueItems") {
            return null;
        }

        if (this.props.activity === "editQueue") {
            return null;
        }

        if (!this.props.canWrite) {
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

    /**
     * A button to start the exercise, not displayed if we're editing the queue
     *
     * @return {object}
     */
    startButton() {
        if (this.props.activity === "editQueue") {
            return null;
        }
        return React.createElement(
            "button",
            {
                "className": "btn btn-success",
                "type": "button",
                "id": "start_" + this.props.exercise.id,
                "onClick": this.startClick
            },
            "Start exercise"
        );
    }

    /**
     * A div to wrap the start button
     *
     * @return {object}
     */
    startDiv() {
        return React.createElement(
            "div",
            {},
            this.startButton()
        );
    }

    /**
     * A card body, with subtitle, description, links and start button
     *
     * @return {object}
     */
    render() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemSubtitle(),
            this.descriptionRow(),
            this.linkDiv(),
            this.startDiv()
        );
    }
}

ExerciseCardBody.propTypes = {
    "activity": PropTypes.string.isRequired,
    "canWrite": PropTypes.bool.isRequired,
    "deleteClick": PropTypes.func.isRequired,
    "exercise": PropTypes.object.isRequired,
    "itemUser": PropTypes.object.isRequired,
    "mediaItem": PropTypes.object.isRequired,
    "saveItem": PropTypes.func.isRequired,
    "selectItem": PropTypes.func.isRequired,
    "selectedType": PropTypes.string.isRequired,
    "startExercise": PropTypes.func.isRequired
};
