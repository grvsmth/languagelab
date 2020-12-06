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
            "Add " + typeInfo[this.props.selectedType].singular
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
        if (!this.props.languages) {
            return [];
        }

        if (!item.language) {
            return [];
        }
        if (typeof item.language === "undefined") {
            return [];
        }
        return [util.findItem(this.props.languages, item.language)];
    }

    queueExercise(selection) {
        if (!selection.exercise) {
            return null;
        }
        return util.findItem(this.props.exercises, selection.exercise);
    }

    exerciseRank(lesson, exercise) {
        if (!lesson) {
            return null;
        }

        const queueItem = lesson.queueItems.find(
            item => item.exercise == exercise.id && item.lesson == lesson.id
        );

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
                this.props.exercises,
                previousQueueItem.exercise
            );
            if (previousExercise) {
                queueInfo["previous"] = previousExercise;
            }
        }

        if (rank < maxRank) {
            const nextExercise = util.findItem(
                this.props.exercises,
                lesson.queueItems.find(item => item.rank == rank + 1).exercise
            );
            if (nextExercise) {
                queueInfo["next"] = nextExercise;
            }
        }

        return queueInfo;
    }

    doCard(key, exercise) {
        const lesson = util.findItem(
            this.props.lessons, this.props.selectedLesson
        );

        const mediaItem = util.findItem(
            this.props.media, exercise.media
        );

        const rank = this.exerciseRank(lesson, exercise);
        const maxRank = this.props.maxRank();

        const options = {
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
            "selectedType": this.props.selectedType
        };

        return React.createElement(
            DoExerciseCard,
            options,
            null
        );
    }

    mediaCard(mediaItem) {
        var cardComponent = MediaCard;
        var languages = this.props.languages;

        if (this.props.activity === "edit"
            && this.props.selectedItem === mediaItem.id) {
            cardComponent = MediaFormCard;
        }

        if (this.props.activity === "add" && typeof mediaItem.id !== "number") {
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
                "selectedItem": this.props.selectedItem,
                "setActivity": this.props.setActivity,
                "saveItem": this.props.saveItem,
                "itemUser": this.itemUser(mediaItem)
            },
            null
        );
    }

    lessonCard(lesson) {
        var cardComponent = LessonCard;

        const selected = this.props.selectedType === "lessons"
            && this.props.selectedLesson === lesson.id;

        if (this.props.activity === "do" && selected) {
            const exercise = util.findItem(
                this.props.exercises, this.props.selectedItem
            );

            const mediaItem = util.findItem(this.props.media, exercise.media);

            return this.doCard(lesson.id, exercise);
        }

        if (this.props.activity === "edit" && selected) {
            cardComponent = LessonFormCard;
        }

        if (this.props.activity === "add" && typeof lesson.id !== "number") {
            cardComponent = LessonFormCard;
        }

        const options = {
            "activity": this.props.activity,
            "deleteClick": this.props.deleteClick,
            "editItem": this.props.editItem,
            "exercises": this.props.exercises,
            "itemUser": this.itemUser(lesson),
            "key": lesson.id,
            "lesson": lesson,
            "mediaItem": null,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selected": selected,
            "selectedItem": this.props.selectedItem,
            "selectedType": this.props.selectedType,
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
            "media": this.props.media,
            "languages": this.props.languages,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selectedType": this.props.selectedType
        };

        return React.createElement(
            ExerciseFormCard,
            options,
            null
        );
    }

    exerciseCard(exercise) {
        const mediaItem = util.findItem(this.props.media, exercise.media);

        if (this.props.selectedItem === exercise.id) {
            if (this.props.activity === "edit") {
                return this.exerciseFormCard(exercise);
            }

            if (this.props.activity === "do") {
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
            "selectedType": this.props.selectedType,
            "startExercise": this.props.startExercise,
            "itemUser": this.itemUser(exercise),
            "lessons": this.props.lessons
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
    itemUser(item, type=this.props.selectedType) {
        if (!this.props.users) {
            return null;
        }

        const userFieldName = typeInfo[type].userField;
        const user = util.findItem(this.props.users, item[userFieldName]);

        return user;
    }

    makeElement(item) {
        return this.itemCard[this.props.selectedType](item);
    }

    addCard(addable, cardId="form") {
        if (cardId === "initial" && !this.props[this.props.selectedType].length) {
            return null;
        }

        if (this.props.activity === "add") {
            if (this.props.selectedItem === cardId) {
                if (this.props.selectedType === "media") {
                    return this.mediaCard({"id": cardId})
                }

                if (this.props.selectedType === "lessons") {
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

    makeElements(myType) {
        if (!this.props[this.props.selectedType].length
            || !myType.hasOwnProperty("card")) {
            return React.createElement(
                "div",
                {"className": "card"},
                `No ${this.props.selectedType} loaded`
            );
        }

        return this.props[this.props.selectedType].map(this.makeElement, this);
    }

    render() {
        console.log(this.props);
        const myType = typeInfo[this.props.selectedType];
        const addable = this.props.activity != "editQueue" && myType.addable;

        return React.createElement(
            "div",
            {"className": ""},
            this.addCard(addable, "initial"),
            this.makeElements(myType),
            this.addCard(addable, "final")
        );
    }
}