/**
 * Generate a list of Bootstrap cards for the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

    global React, PropTypes

*/
import util from "./util.js";

import ControlCard from "./cards/controlCard.js";
import DoExerciseCard from "./cards/doExerciseCard.js";
import ExerciseCard from "./cards/exerciseCard.js";
import ExerciseFormCard from "./cards/exerciseFormCard.js";
import help from "./help.js";
import HelpCard from "./cards/helpCard.js";
import LanguageCard from "./cards/languageCard.js";
import LanguageFormCard from "./cards/languageFormCard.js";
import LessonCard from "./cards/lessonCard.js";
import LessonFormCard from "./cards/lessonFormCard.js";
import MediaCard from "./cards/mediaCard.js";
import MediaFormCard from "./cards/mediaFormCard.js";

const typeInfo = {
    "media": {
        "addable": true,
        "card": MediaCard,
        "cardLayout": "",
        "doable": false,
        "formCard": MediaFormCard,
        "singular": "media item",
        "userField": "uploader"
    },
    "exercises": {
        "addable": true,
        "card": ExerciseCard,
        "cardLayout": "",
        "doable": true,
        "formCard": ExerciseFormCard,
        "singular": "exercise",
        "userField": "creator"
    },
    "lessons": {
        "addable": true,
        "card": LessonCard,
        "cardLayout": "",
        "doable": false,
        "formCard": LessonFormCard,
        "singular": "lesson",
        "userField": "creator"
    },
    "languages": {
        "addable": true,
        "card": LanguageCard,
        "cardLayout": "card-columns",
        "doable": false,
        "singular": "language",
        "userField": ""
    },
    "controls": {
        "addable": false,
        "card": ControlCard,
        "cardLayout": "card-columns",
        "doable": false,
        "singular": "control",
        "userField": ""
    },
    "help": {
        "addable": false,
        "card": HelpCard,
        "cardLayout": "card-columns",
        "doable": false,
        "singular": "help items",
        "userField": ""
    }
};

const doActivities = ["do", "loadExercise"];

export default class CardList extends React.Component {

    /**
     * Extend the constructor method with an itemCard property mapping item
     * keys to card generator methods.
     *
     * @param {object} props - the React props passed from the calling script
     */
    constructor(props) {
        super(props);

        this.itemCard = {
            "controls": this.controlCard.bind(this),
            "exercises": this.exerciseCard.bind(this),
            "help": this.helpCard.bind(this),
            "languages": this.languageCard.bind(this),
            "lessons": this.lessonCard.bind(this),
            "media": this.mediaCard.bind(this)
        }
    }

    /**
     * Handle a click on the "add" button, passing the button ID to selectItem()
     *
     * @param {object} event - the click event passed by the browser
     */
    addClick(event) {
        this.props.selectItem(event.target.id, "add");
    }

    /**
     * Generate an add button
     *
     * @param {string} cardId - the name of the button (initial or final)
     *
     * @return {object}
     */
    addButtonElement(cardId) {
        return React.createElement(
            "button",
            {
                "id": cardId,
                "type": "button",
                "className": "btn btn-primary",
                "onClick": this.addClick.bind(this)
            },
            "Add " + typeInfo[this.props.state.selected.itemType].singular
        );
    }

    /**
     * A card body to wrap around the add button and fit with the rest of the
     * cards
     *
     * @param {string} cardId - special IDs ("initial"/"final") for add buttons
     *
     * @return {object}
     */
    addButtonCardBody(cardId) {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.addButtonElement(cardId)
        );
    }

    /**
     * A card to wrap around the add button card body and fit with the rest of
     * the cards
     *
     * @param {string} cardId - special IDs ("initial"/"final") for add buttons
     *
     * @return {object}
     */
    addButtonCard(cardId) {
        return React.createElement(
            "div",
            {
                "className": "card",
                "key": cardId,
                "id": cardId
            },
            this.addButtonCardBody(cardId)
        );
    }

    /**
     * Find the exercise specified in a queue item.  If the queue item has no
     * exercise parameter, return null.
     *
     * @param {object} selection - A queueItem with an exercise holding an ID
     *
     * @return {object}
     */
    queueExercise(selection) {
        if (!selection.exercise) {
            return null;
        }
        return util.findItem(this.props.state.exercises, selection.exercise);
    }

    /**
     * Find a queueItem with a given lesson and exercise
     *
     * @param {number} lesson - the ID of the selected lesson
     * @param {number} exercise - the ID of the selected exercise
     *
     * @return {object}
     */
    queueItem(lesson, exercise) {
        if (!lesson) {
            return null;
        }

        return lesson.queueItems.find(
            item => item.exercise == exercise.id && item.lesson == lesson.id
        );
    }

    /**
     * Find the rank of a given exercise in the queue of a given lesson
     *
     * @param {number} lesson - the ID of the selected lesson
     * @param {number} exercise - the ID of the selected exercise
     *
     * @return {number}
     */
    exerciseRank(lesson, exercise) {
        if (!lesson) {
            return null;
        }

        const queueItem = this.queueItem(lesson, exercise);

        if (!queueItem) {
            return null;
        }

        return queueItem.rank;
    }

    /**
     * Assemble the queue information needed in a DoExerciseCard
     *
     * @param {number} lesson - the ID of the selected lesson
     * @param {number} rank - the rank of the current exercise
     * @param {number} maxRank - the rank of the last exercise in the queue
     *
     * @return {object}
     */
    queueInfo(lesson, rank, maxRank) {
        const queueInfo = {};

        if (rank > 1) {
            const previousQueueItem = lesson.queueItems.find(
                item => item.rank == rank - 1
            );

            const previousExercise = util.findItem(
                this.props.state.exercises,
                previousQueueItem.exercise
            );
            if (previousExercise) {
                queueInfo["previous"] = previousExercise;
            }
        }

        if (rank < maxRank) {
            const nextQueueItem = lesson.queueItems.find(
                item => item.rank == rank + 1
            );

            const nextExercise = util.findItem(
                this.props.state.exercises,
                nextQueueItem.exercise
            );
            if (nextExercise) {
                queueInfo["next"] = nextExercise;
            }
        }

        return queueInfo;
    }

    /**
     * Method to generate a ControlCard, including the exportData method
     *
     * @param {object} control - the text, links, etc. to display in the card
     *
     * @return {object}
     */
    controlCard(control) {
        return React.createElement(
            ControlCard,
            {
                "key": control.name,
                "control": control,
                "exportData": this.props.exportData
            },
            null
        );
    }

    /**
     * Method to generate a HelpCard
     *
     * @param {object} helpItem - the text, links, etc. to display in the card
     *
     * @return {object}
     */
    helpCard(helpItem) {
        return React.createElement(
            HelpCard,
            {
                "key": helpItem.title,
                "helpItem": helpItem
            },
            null
        )
    }

    /**
     * Generate a DoExerciseCard
     *
     * @param {number} key - the React key for the card
     * @param {object} exercise - the exercise to be performed in the card
     *
     * @return {object}
     */
    doCard(key, exercise) {
        const lesson = util.findItem(
            this.props.state.lessons, this.props.state.selected.lessons
        );

        const mediaItem = util.findItem(
            this.props.state.media, exercise.media
        );

        const rank = this.exerciseRank(lesson, exercise);
        const maxRank = this.props.maxRank();

        const options = {
            "doButton": this.props.doButton,
            "doFunction": this.props.doFunction,
            "key": key,
            "exercise": exercise,
            "lesson": lesson,
            "maxRank": maxRank,
            "mediaItem": mediaItem,
            "queueInfo": this.queueInfo(lesson, rank, maxRank),
            "rank": rank,
            "setActivity": this.props.setActivity,
            "state": this.props.state
        };

        return React.createElement(
            DoExerciseCard,
            options,
            null
        );
    }

    /**
     * If we are adding or editing, return a MediaFormCard, otherwise return a
     * MediaCard
     *
     * @param {object} mediaItem - the media item to be displayed or edited
     *
     * @return {object}
     */
    mediaCard(mediaItem) {
        var cardComponent = MediaCard;

        if (this.props.state.activity === "edit"
            && this.props.state.selected.media === mediaItem.id) {
            cardComponent = MediaFormCard;
        }

        if (this.props.state.activity === "add"
            && typeof mediaItem.id !== "number"
            ) {
            cardComponent = MediaFormCard;
        }

        return React.createElement(
            cardComponent,
            {
                "checkClick": this.props.checkClick,
                "deleteClick": this.props.deleteClick,
                "id": mediaItem.id,
                "key": mediaItem.id,
                "languages": this.props.state.languages,
                "mediaItem": mediaItem,
                "saveItem": this.props.saveItem,
                "selectItem": this.props.selectItem,
                "selectedItem": this.props.state.selected.media,
                "setActivity": this.props.setActivity,
                "itemUser": this.itemUser(mediaItem)
            },
            null
        );
    }

    /**
     * If we are adding or editing, return a LanguageFormCard, otherwise return a
     * LanguageCard
     *
     * @param {object} language - the language to be displayed or edited
     *
     * @return {object}
     */
    languageCard(language) {
        var cardComponent = LanguageCard;

        if (this.props.state.activity === "edit"
            && this.props.state.selected.languages === language.id) {
            cardComponent = LanguageFormCard;
        }

        if (this.props.state.activity === "add"
            && typeof language.id !== "number"
            ) {
            cardComponent = LanguageFormCard;
        }

        return React.createElement(
            cardComponent,
            {
                "key": language.id,
                "language": language,
                "saveItem": this.props.saveItem,
                "selectItem": this.props.selectItem,
                "setActivity": this.props.setActivity
            },
            null
        );
    }

    /**
     * If we are adding or editing, return a LessonFormCard.  If we are doing
     * an exercise within a lesson (playModel, playMimic) return a
     * DoExerciseCard.  Otherwise return a LessonCard.
     *
     * @param {object} lesson - the lesson to be displayed or edited
     *
     * @return {object}
     */
    lessonCard(lesson) {
        var cardComponent = LessonCard;

        if (this.props.state.activity === "editQueue") {
            /**
             * This is actually an exercise retrieved by queueExercise(), not
             * a lesson!
             */
            return this.exerciseCard(lesson);
        }

        const selected = this.props.state.selected.lessons === lesson.id;

        if (doActivities.includes(this.props.state.activity) && selected) {
            const exercise = util.findItem(
                this.props.state.exercises, this.props.state.selected.exercises
            );
            return this.doCard(lesson.id, exercise);
        }

        if (this.props.state.activity === "edit" && selected) {
            cardComponent = LessonFormCard;
        }

        if (this.props.state.activity === "add"
            && typeof lesson.id !== "number"
        ) {
            cardComponent = LessonFormCard;
        }

        const options = {
            "activity": this.props.state.activity,
            "deleteClick": this.props.deleteClick,
            "exercisesLoading": this.props.state.loading.exercises,
            "itemUser": this.itemUser(lesson),
            "key": lesson.id,
            "lesson": lesson,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selected": selected,
            "selectItem": this.props.selectItem,
            "toggleLesson": this.props.toggleLesson
        };

        return React.createElement(
            cardComponent,
            options,
            null
        );
    }

    /**
     * Return an ExerciseFormCard
     *
     * @param {object} exercise - the exercise to be edited
     *
     * @return {object}
     */
    exerciseFormCard(exercise) {
        var options = {
            "key": exercise.id,
            "exercise": exercise,
            "itemUser": this.itemUser(exercise),
            "media": this.props.state.media,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selectedType": this.props.state.selected.itemType
        };

        return React.createElement(
            ExerciseFormCard,
            options,
            null
        );
    }

    /**
     * If we're editing or adding, return an ExerciseFormCard.  If we're doing
     * the exercise (play or record), return a DoExerciseCard.  Otherwise,
     * return an ExerciseCard.
     *
     * @param {object} exercise - the exercise to be displayed, done or edited
     *
     * @return {object}
     */
    exerciseCard(exercise) {
        const mediaItem = util.findItem(this.props.state.media, exercise.media);
        const lesson = util.findItem(
            this.props.state.lessons, this.props.state.selected.lessons
        );

        if (this.props.state.selected.exercises === exercise.id) {
            if (["edit", "add"].includes(this.props.state.activity)) {
                return this.exerciseFormCard(exercise);
            }

            if (doActivities.includes(this.props.state.activity)) {
                return this.doCard(exercise.id, exercise);
            }
        }

        var options = {
            "activity": this.props.state.activity,
            "checkClick": this.props.checkClick,
            "deleteClick": this.props.deleteClick,
            "exercise": exercise,
            "key": exercise.id,
            "itemUser": this.itemUser(exercise),
            "lessons": this.props.state.lessons,
            "mediaItem": mediaItem,
            "maxRank": this.props.maxRank(),
            "queueClick": this.props.queueClick,
            "queueItem": this.queueItem(lesson, exercise),
            "selectedType": this.props.state.selected.itemType,
            "selectItem": this.props.selectItem,
            "startExercise": this.props.startExercise
        };

        return React.createElement(
            ExerciseCard,
            options,
            null
        );
    }

    /**
     * Find the user associated with an item, with an optional type
     *
     * @param item {object} the item to be investigated
     * @param type {string} the type of item it is
     *
     * @return {object}
     */
    itemUser(item, type=this.props.state.selected.itemType) {
        if (!this.props.state.users) {
            return null;
        }

        const userFieldName = typeInfo[type].userField;
        const user = util.findItem(this.props.state.users, item[userFieldName]);

        return user;
    }

    /**
     * Call the appropriate itemCard for the given item and selecte item type
     *
     * @param {object} item - An item from the list for the selected type
     * @return {object}
     */
    makeElement(item) {
        return this.itemCard[this.props.state.selected.itemType](item);
    }

    /**
     * Return the appropriate add card for the given card ID and selected item
     * type.
     *
     * @param {boolean} addable - whether this type allows the user to add items
     * @param {string} cardId - Initial or final, to track the card's place
     *
     * @return {object}
     */
    addCard(addable, cardId="form") {
        if (!addable) {
            return null;
        }

        const selectedState = this.props.state.selected;
        if (cardId === "initial"
            && !this.props.state[selectedState.itemType].length) {
            return null;
        }

        if (this.props.state.activity === "add"
            && selectedState[selectedState.itemType] === cardId
            ) {
            return this.itemCard[selectedState.itemType](
                {"id": cardId}
            );
        }

        return this.addButtonCard(cardId);
    }

    /**
     * Return an array of items as the basis of cards for display to the user
     *
     * @param {string} itemType - the type of item selected by the user
     *
     * @return {array}
     */
    makeItemList(itemType) {
        if (itemType === "help") {
            return Object.values(help);
        }

        if (this.props.state.activity !== "editQueue") {
            return this.props.state[itemType];
        }

        const lesson = util.findItem(
            this.props.state.lessons, this.props.state.selected.lessons
        );
        return lesson.queueItems.map(this.queueExercise.bind(this));
    }

    /**
     * Return an array of cards for display to the user
     *
     * @param {string} itemType - the type of item selected by the user
     *
     * @return {array}
     */
    makeElements(itemType) {
        const items = itemType === "help" ?
            Object.values(help) : this.props.state[itemType];

        if (!items.length || !Object.prototype.hasOwnProperty.call(
            typeInfo[itemType],
            "card"
            )
        ) {

            if (Object.prototype.hasOwnProperty.call(help, itemType)) {
                return this.helpCard(help[itemType]);
            }

            return React.createElement(
                "div",
                {"className": "card"},
                `No ${itemType} loaded`
            );
        }

        const itemList = this.makeItemList(itemType);
        return itemList.map(this.makeElement, this);
    }

    /**
     * The React render() method
     *
     * @return {object}
     */
    render() {
        console.log(this.props);
        const itemType = this.props.state.selected.itemType;
        const addable = this.props.state.activity !== "editQueue"
            && typeInfo[itemType].addable;

        return React.createElement(
            "div",
            {"className": typeInfo[itemType].cardLayout},
            this.addCard(addable, "initial"),
            this.makeElements(itemType),
            this.addCard(addable, "final")
        );
    }
}

CardList.propTypes = {
    "checkClick": PropTypes.func.isRequired,
    "deleteClick": PropTypes.func.isRequired,
    "doButton": PropTypes.object.isRequired,
    "doFunction": PropTypes.object.isRequired,
    "exportData": PropTypes.func.isRequired,
    "maxRank": PropTypes.number.isRequired,
    "queueClick": PropTypes.object.isRequired,
    "saveItem": PropTypes.func.isRequired,
    "selectItem": PropTypes.func.isRequired,
    "setActivity": PropTypes.func.isRequired,
    "startExercise": PropTypes.func.isRequired,
    "state": PropTypes.object.isRequired,
    "toggleLesson": PropTypes.func.isRequired
};
