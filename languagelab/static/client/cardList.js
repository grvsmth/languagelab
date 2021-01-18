import util from "./util.js";

import ExerciseCard from "./exerciseCard.js";
import DoExerciseCard from "./doExerciseCard.js";
import ExerciseFormCard from "./exerciseFormCard.js";
import LessonCard from "./lessonCard.js";
import LessonFormCard from "./lessonFormCard.js";
import MediaCard from "./mediaCard.js";
import MediaFormCard from "./mediaFormCard.js";

const typeInfo = {
    "media": {
        "singular": "media item",
        "userField": "uploader",
        "card": MediaCard,
        "formCard": MediaFormCard,
        "addable": true,
        "doable": false
    },
    "exercises": {
        "singular": "exercise",
        "userField": "creator",
        "card": ExerciseCard,
        "formCard": ExerciseFormCard,
        "addable": true,
        "doable": true
    },
    "lessons": {
        "singular": "lesson",
        "userField": "creator",
        "card": LessonCard,
        "formCard": LessonFormCard,
        "addable": true,
        "doable": false
    },
    "languages": {
        "singular": "language",
        "userField": "",
        "addable": true,
        "doable": false
    }
};

const doActivities = ["do", "loadExercise"];

export default class CardList extends React.Component {
    constructor(props) {
        super(props);

        this.itemCard = {
            "exercises": this.exerciseCard.bind(this),
            "lessons": this.lessonCard.bind(this),
            "media": this.mediaCard.bind(this)
        }

        this.findLanguage = this.findLanguage.bind(this);
    }

    addClick(event) {
        this.props.setActivity("add", event.target.id);
    }

    addButtonElement(cardId) {
        return React.createElement(
            "button",
            {
                "id": cardId,
                "type": "button",
                "className": "btn btn-primary",
                "onClick": this.addClick.bind(this)
            },
            "Add " + typeInfo[this.props.state.selectedType].singular
        );
    }

    addButtonCardBody(cardId) {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.addButtonElement(cardId)
        );
    }

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

    findLanguage(item) {
        if (!this.props.state.languages) {
            return [];
        }

        if (!item.language) {
            return [];
        }
        if (typeof item.language === "undefined") {
            return [];
        }
        return [util.findItem(this.props.state.languages, item.language)];
    }

    queueExercise(selection) {
        if (!selection.exercise) {
            return null;
        }
        return util.findItem(this.props.state.exercises, selection.exercise);
    }

    queueItem(lesson, exercise) {
        if (!lesson) {
            return null;
        }

        return lesson.queueItems.find(
            item => item.exercise == exercise.id && item.lesson == lesson.id
        );
    }

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

    doCard(key, exercise) {
        const lesson = util.findItem(
            this.props.state.lessons, this.props.state.selectedLesson
        );

        const mediaItem = util.findItem(
            this.props.state.media, exercise.media
        );

        const rank = this.exerciseRank(lesson, exercise);
        const maxRank = this.props.maxRank();

        const options = {
            "activity": this.props.state.activity,
            "currentUser": this.props.currentUser,
            "doButton": this.props.doButton,
            "key": key,
            "exercise": exercise,
            "exitClick": this.props.exitDo,
            "exerciseUser": this.itemUser(exercise, "exercises"),
            "languages": this.findLanguage(exercise),
            "lesson": lesson,
            "maxRank": maxRank,
            "mediaItem": mediaItem,
            "queueNav": this.props.queueNav,
            "queueInfo": this.queueInfo(lesson, rank, maxRank),
            "rank": rank,
            "setActivity": this.props.setActivity,
            "setStatus": this.props.setStatus,
            "state": this.props.state
        };

        return React.createElement(
            DoExerciseCard,
            options,
            null
        );
    }

    mediaCard(mediaItem) {
        var cardComponent = MediaCard;
        var languages = this.props.state.languages;

        if (this.props.state.activity === "edit"
            && this.props.state.selectedItem === mediaItem.id) {
            cardComponent = MediaFormCard;
        }

        if (this.props.state.activity === "add" && typeof mediaItem.id !== "number") {
            cardComponent = MediaFormCard;
        }

        return React.createElement(
            cardComponent,
            {
                "checkClick": this.props.checkClick,
                "deleteClick": this.props.deleteClick,
                "editItem": this.props.editItem,
                "id": mediaItem.id,
                "key": mediaItem.id,
                "languages": languages,
                "mediaItem": mediaItem,
                "selectItem": this.props.selectItem,
                "selectedItem": this.props.state.selectedItem,
                "setActivity": this.props.setActivity,
                "saveItem": this.props.saveItem,
                "itemUser": this.itemUser(mediaItem)
            },
            null
        );
    }

    lessonCard(lesson) {
        var cardComponent = LessonCard;

        if (this.props.state.activity === "editQueue") {
            return this.exerciseCard(lesson);
        }

        const selected = this.props.state.selectedType === "lessons"
            && this.props.state.selectedLesson === lesson.id;

        if (doActivities.includes(this.props.state.activity) && selected) {
            const exercise = util.findItem(
                this.props.state.exercises, this.props.state.selectedItem
            );

            const mediaItem = util.findItem(this.props.state.media, exercise.media);

            return this.doCard(lesson.id, exercise);
        }

        if (this.props.state.activity === "edit" && selected) {
            cardComponent = LessonFormCard;
        }

        if (this.props.state.activity === "add" && typeof lesson.id !== "number") {
            cardComponent = LessonFormCard;
        }

        const options = {
            "activity": this.props.state.activity,
            "deleteClick": this.props.deleteClick,
            "editItem": this.props.editItem,
            "exercises": this.props.state.exercises,
            "itemUser": this.itemUser(lesson),
            "key": lesson.id,
            "lesson": lesson,
            "mediaItem": null,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selected": selected,
            "selectedItem": this.props.state.selectedItem,
            "selectedType": this.props.state.selectedType,
            "toggleLesson": this.props.toggleLesson
        };

        return React.createElement(
            cardComponent,
            options,
            null
        );
    }

    exerciseFormCard(exercise) {
        var options = {
            "key": exercise.id,
            "exercise": exercise,
            "itemUser": this.itemUser(exercise),
            "media": this.props.state.media,
            "languages": this.props.state.languages,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selectedType": this.props.state.selectedType
        };

        return React.createElement(
            ExerciseFormCard,
            options,
            null
        );
    }

    exerciseCard(exercise) {
        const mediaItem = util.findItem(this.props.state.media, exercise.media);
        const lesson = util.findItem(
            this.props.state.lessons, this.props.state.selectedLesson
        );

        if (this.props.state.selectedItem === exercise.id) {
            if (this.props.state.activity === "edit") {
                return this.exerciseFormCard(exercise);
            }

            if (doActivities.includes(this.props.state.activity)) {
                return this.doCard(exercise.id, exercise);
            }
        }

        var options = {
            "checkClick": this.props.checkClick,
            "deleteClick": this.props.deleteClick,
            "editItem": this.props.editItem,
            "exercise": exercise,
            "key": exercise.id,
            "languages": this.findLanguage(exercise),
            "mediaItem": mediaItem,
            "maxRank": this.props.maxRank(),
            "queueClick": this.props.queueClick,
            "queueItem": this.queueItem(lesson, exercise),
            "selectedType": this.props.state.selectedType,
            "startExercise": this.props.startExercise,
            "itemUser": this.itemUser(exercise),
            "lessons": this.props.state.lessons
        };

        return React.createElement(
            ExerciseCard,
            options,
            null
        );
    }

    /*

        Find the user associated with the item

    */
    itemUser(item, type=this.props.state.selectedType) {
        if (!this.props.users) {
            return null;
        }

        const userFieldName = typeInfo[type].userField;
        const user = util.findItem(this.props.users, item[userFieldName]);

        return user;
    }

    makeElement(item) {
        return this.itemCard[this.props.state.selectedType](item);
    }

    addCard(addable, cardId="form") {
        if (cardId === "initial" && !this.props.state[this.props.state.selectedType].length) {
            return null;
        }

        if (this.props.state.activity === "add") {
            if (this.props.state.selectedItem === cardId) {
                if (this.props.state.selectedType === "media") {
                    return this.mediaCard({"id": cardId})
                }

                if (this.props.state.selectedType === "lessons") {
                    return this.lessonCard({"id": cardId});
                }

                return this.exerciseFormCard(cardId, {"id": cardId});
            }
        }

        if (addable) {
            return this.addButtonCard(cardId);
        }
        return null;
    }

    makeItemList(myType) {
        if (this.props.state.activity !== "editQueue") {
            return this.props.state[this.props.state.selectedType];
        }

        const lesson = util.findItem(
            this.props.state.lessons, this.props.state.selectedLesson
        );
        return lesson.queueItems.map(this.queueExercise.bind(this));
    }

    makeElements(myType) {
        if (!this.props.state[this.props.state.selectedType].length
            || !myType.hasOwnProperty("card")) {
            return React.createElement(
                "div",
                {"className": "card"},
                `No ${this.props.state.selectedType} loaded`
            );
        }

        const itemList = this.makeItemList(myType);

        return itemList.map(this.makeElement, this);
    }

    render() {
        const myType = typeInfo[this.props.state.selectedType];
        const addable = this.props.state.activity != "editQueue" && myType.addable;

        return React.createElement(
            "div",
            {"className": ""},
            this.addCard(addable, "initial"),
            this.makeElements(myType),
            this.addCard(addable, "final")
        );
    }
}
