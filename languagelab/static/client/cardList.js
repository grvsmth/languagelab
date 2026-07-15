/**
 * Generate a list of Bootstrap cards for the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

import help from "./help.js";
import util from "./util.js";

import ControlCard from "./cards/controlCard.js";
import DoExerciseCard from "./cards/doExerciseCard.js";
import ExerciseCard from "./cards/exerciseCard.js";
import ExerciseFormCard from "./cards/exerciseFormCard.js";
import HelpCard from "./cards/helpCard.js";
import LanguageCard from "./cards/languageCard.js";
import LanguageFormCard from "./cards/languageFormCard.js";
import LessonCard from "./cards/lessonCard.js";
import LessonFormCard from "./cards/lessonFormCard.js";
import MediaCard from "./cards/mediaCard.js";
import MediaFormCard from "./cards/mediaFormCard.js";

const typeInfo = {
    "controls": {
        "addable": false,
        "card": ControlCard,
        "cardLayout": ["row", "row-cols-1", "row-cols-md-2", "g-3"],
        "doable": false,
        "singular": "control",
        "userField": ""
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
    "help": {
        "addable": false,
        "card": HelpCard,
        "cardLayout": ["row", "row-cols-1", "row-cols-md-2", "g-3"],
        "doable": false,
        "singular": "help items",
        "userField": ""
    },
    "languages": {
        "addable": true,
        "card": LanguageCard,
        "cardLayout": ["row", "row-cols-1", "row-cols-md-2", "g-3"],
        "doable": false,
        "singular": "language",
        "userField": ""
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
    "media": {
        "addable": true,
        "card": MediaCard,
        "cardLayout": "",
        "doable": false,
        "formCard": MediaFormCard,
        "singular": "media item",
        "userField": "uploader"
    }
};

const doActivities = ["do", "loadExercise"];

export default class CardList {

    /**
     * Extend the constructor method with an itemCard property mapping item
     * keys to card generator methods.
     *
     */
    constructor() {
        this.itemCard = {
            "controls": this.controlCard.bind(this),
            "exercises": this.exerciseCard.bind(this),
            "help": this.helpCard.bind(this),
            "languages": this.languageCard.bind(this),
            "lessons": this.lessonCard.bind(this),
            "media": this.mediaCard.bind(this)
        };
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
        const element = document.createElement("button");
        element.id = cardId;
        element.type = "button";
        element.classList.add("btn", "btn-primary");
        element.addEventListener("click", this.addClick.bind(this));

        element.innerText = "Add "
            + typeInfo[this.props.selected.itemType].singular;

        return element;
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
        const element = document.createElement("div");
        element.classList.add("card-body");
        element.append(this.addButtonElement(cardId));

        return element;
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
        const col = document.createElement("div");
        col.classList.add("col");

        const element = document.createElement("div");
        element.classList.add("card");
        element.id = cardId;
        element.append(this.addButtonCardBody(cardId));

        col.append(element);
        return col;
    }

    /**
     * Find the exercise specified in a queue item.  If the queue item has no
     * exercise parameter, return "".
     *
     * @param {object} selection - A queueItem with an exercise holding an ID
     *
     * @return {object}
     */
    queueExercise(selection) {
        if (!selection.exercise) {
            return "";
        }
        return util.findItem(this.props.data.exercises, selection.exercise);
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
            return "";
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
            return "";
        }

        const queueItem = this.queueItem(lesson, exercise);

        if (!queueItem) {
            return "";
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
                this.props.data.exercises,
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
                this.props.data.exercises,
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
        const element = new ControlCard();

        return element.render(
            {
                "key": control.name,
                "control": control,
                "exportData": this.props.exportData
            }
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
        const element = new HelpCard();

        return element.render({
            "key": helpItem.title,
            "helpItem": helpItem
        });
    }

    /**
     * Generate a DoExerciseCard
     *
     * @param {number} key - the key for the card
     * @param {object} exercise - the exercise to be performed in the card
     *
     * @return {object}
     */
    doCard(key, exercise) {
        const lesson = util.findItem(
            this.props.data.lessons, this.props.selected.lessons
        );

        const mediaItem = util.findItem(
            this.props.data.media, exercise.media
        );

        const maxRank = this.props.maxRank();
        const rank = this.exerciseRank(lesson, exercise);

        const options = {
            "doFunction": this.props.doFunction,
            "exercise": exercise,
            "lesson": lesson,
            "maxRank": maxRank,
            "mediaItem": mediaItem,
            "mimicCount": this.props.mimicCount,
            "onlyExercise": this.props.state.onlyExercise,
            "nowPlaying": this.props.state.nowPlaying,
            "queueInfo": this.queueInfo(lesson, rank, maxRank),
            "queueNav": this.props.doFunction.queueNav,
            "rank": rank,
            "selected": this.props.selected,
            "setActivity": this.props.setActivity,
            "status": this.props.state.status
        };

        const element = new DoExerciseCard();
        return element.render(options);
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
        let cardComponent = MediaCard;

        if (this.props.activity === "edit"
            && this.props.selected.media === mediaItem.id) {
            cardComponent = MediaFormCard;
        }

        if (this.props.activity === "add"
            && typeof mediaItem.id !== "number"
            ) {
            cardComponent = MediaFormCard;
        }

        const element = new cardComponent();
        return element.render({
            "checkClick": this.props.checkClick,
            "deleteClick": this.props.deleteClick,
            "id": mediaItem.id,
            "key": mediaItem.id,
            "languages": this.props.data.languages,
            "mediaItem": mediaItem,
            "saveItem": this.props.saveItem,
            "selectItem": this.props.selectItem,
            "selectedItem": this.props.selected.media,
            "setActivity": this.props.setActivity,
            "itemUser": this.itemUser(mediaItem)
        });
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
        let cardComponent = LanguageCard;

        if (this.props.activity === "edit"
            && this.props.selected.languages === language.id) {
            cardComponent = LanguageFormCard;
        }

        if (this.props.activity === "add"
            && typeof language.id !== "number"
            ) {
            cardComponent = LanguageFormCard;
        }

        const element = new cardComponent();
        return element.render({
            "key": language.id,
            "language": language,
            "saveItem": this.props.saveItem,
            "selectItem": this.props.selectItem,
            "setActivity": this.props.setActivity
        });
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
        let cardComponent = LessonCard;

        if (this.props.activity === "editQueue") {
            /**
             * This is actually an exercise retrieved by queueExercise(), not
             * a lesson!
             */
            return this.exerciseCard(lesson);
        }

        const selected = this.props.selected.lessons === lesson.id;

        if (doActivities.includes(this.props.activity) && selected) {
            const exercise = util.findItem(
                this.props.data.exercises, this.props.selected.exercises
            );
            return this.doCard(lesson.id, exercise);
        }

        if (this.props.activity === "edit" && selected) {
            cardComponent = LessonFormCard;
        }

        if (this.props.activity === "add"
            && typeof lesson.id !== "number"
        ) {
            cardComponent = LessonFormCard;
        }

        let canWrite = true;
        if (this.props.staffCanWrite
            && !this.props.currentUser.is_staff) {
                canWrite = false;
        }

        const options = {
            "activity": this.props.activity,
            "canWrite": canWrite,
            "deleteClick": this.props.deleteClick,
            "exercisesLoading": this.props.loading.exercises,
            "itemUser": this.itemUser(lesson),
            "key": lesson.id,
            "lesson": lesson,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selected": selected,
            "selectItem": this.props.selectItem,
            "toggleLesson": this.props.toggleLesson
        };

        const component = new cardComponent();
        return component.render(options);
    }

    /**
     * Return an ExerciseFormCard
     *
     * @param {object} exercise - the exercise to be edited
     *
     * @return {object}
     */
    exerciseFormCard(exercise) {
        let options = {
            "key": exercise.id,
            "exercise": exercise,
            "itemUser": this.itemUser(exercise),
            "media": this.props.data.media,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selectedType": this.props.selected.itemType
        };

        const element = new ExerciseFormCard();
        return element.render(options);
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
        const mediaItem = util.findItem(this.props.data.media, exercise.media);
        const lesson = util.findItem(
            this.props.data.lessons, this.props.selected.lessons
        );

        if (this.props.selected.exercises === exercise.id) {
            if (["edit", "add"].includes(this.props.activity)) {
                return this.exerciseFormCard(exercise);
            }

            if (doActivities.includes(this.props.activity)) {
                return this.doCard(exercise.id, exercise);
            }
        }

        let canWrite = true;
        if (this.props.staffCanWrite
            && !this.props.currentUser.is_staff) {
                canWrite = false;
        }

        let options = {
            "activity": this.props.activity,
            "canWrite": canWrite,
            "checkClick": this.props.checkClick,
            "deleteClick": this.props.deleteClick,
            "exercise": exercise,
            "key": exercise.id,
            "itemUser": this.itemUser(exercise),
            "lessons": this.props.data.lessons,
            "mediaItem": mediaItem,
            "maxRank": this.props.maxRank(),
            "queueClick": this.props.queueClick,
            "queueItem": this.queueItem(lesson, exercise),
            "selectedType": this.props.selected.itemType,
            "selectItem": this.props.selectItem,
            "startExercise": this.props.startExercise
        };

        const element = new ExerciseCard();
        return element.render(options);
    }

    /**
     * Find the user associated with an item, with an optional type
     *
     * @param item {object} the item to be investigated
     * @param type {string} the type of item it is
     *
     * @return {object}
     */
    itemUser(item, type=this.props.selected.itemType) {
        if (!this.props.data.users) {
            return "";
        }

        const userFieldName = typeInfo[type].userField;
        const user = util.findItem(this.props.data.users, item[userFieldName]);

        return user;
    }

    /**
     * Call the appropriate itemCard for the given item and selecte item type
     *
     * @param {object} item - An item from the list for the selected type
     * @return {object}
     */
    makeElement(item) {
        return this.itemCard[this.props.selected.itemType](item);
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
            return "";
        }

        if (this.props.staffCanWrite
            && !this.props.currentUser.is_staff) {
                return "";
        }

        if (cardId === "initial"
            && !this.props.data[this.props.selected.itemType].length) {
            return "";
        }

        if (this.props.activity === "add"
            && this.props.selected[this.props.selected.itemType] === cardId
            ) {
            return this.itemCard[this.props.selected.itemType](
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

        if (this.props.activity !== "editQueue") {
            return this.props.data[itemType];
        }

        const lesson = util.findItem(
            this.props.data.lessons, this.props.selected.lessons
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
            Object.values(help) : this.props.data[itemType];

        if (!items.length || !("card" in typeInfo[itemType])) {
            if (itemType in help) {
                return [this.helpCard(help[itemType])];
            }

            const element = document.createElement("div");
            element.classList.add("card");
            element.innerText = `No ${itemType} loaded`;

            return [element];
        }

        const itemList = this.makeItemList(itemType);
        return itemList.map(this.makeElement, this);
    }

    /**
     * @param {object} props - the props passed from the calling script
     *
     * @return {object}
     */
    render(props) {
        this.props = props;
        console.log("CardList", this.props);

        const itemType = this.props.selected.itemType;
        const addable = this.props.activity !== "editQueue"
            && typeInfo[itemType].addable;

        const element = document.createElement("div");

        if (typeInfo[itemType].cardLayout) {
            element.classList.add(...typeInfo[itemType].cardLayout);
        }

        element.append(this.addCard(addable, "initial"));
        element.append(...this.makeElements(itemType));
        element.append(this.addCard(addable, "final"));

        return element;
    }
}
