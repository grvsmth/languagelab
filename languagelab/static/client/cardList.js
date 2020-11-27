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
        "userField": "uploader",
        "card": MediaCard,
        "formCard": MediaFormCard,
        "addable": true,
        "doable": false
    },
    "exercises": {
        "userField": "creator",
        "card": ExerciseCard,
        "formCard": ExerciseFormCard,
        "addable": true,
        "doable": true
    },
    "lessons": {
        "userField": "creator",
        "card": LessonCard,
        "formCard": LessonFormCard,
        "addable": true,
        "doable": false
    },
    "queueItems": {
        "userField": "user",
        "card": ExerciseCard,
        "addable": false,
        "doable": true
    },
    "languages": {
        "userField": "",
        "addable": true,
        "doable": false
    }
};

export default class CardList extends React.Component {
    constructor(props) {
        super(props);

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
            `Add ${this.props.selectedType} item`
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

    doCard(key, queueItem, exercise, mediaItem) {
        var options = {
            "currentUser": this.props.currentUser,
            "doButton": this.props.doButton,
            "key": key,
            "exercise": exercise,
            "exitClick": this.props.exitDo,
            "itemUser": this.itemUser(exercise),
            "queueItem": queueItem,
            "queueNav": this.props.queueNav,
            "languages": this.findLanguage(exercise),
            "maxRank": this.props.maxRank(),
            "mediaItem": mediaItem,
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

        if (this.props.activity === "edit"
            && this.props.selectedItem === lesson.id) {
            cardComponent = LessonFormCard;
        }

        if (this.props.activity === "add" && typeof lesson.id !== "number") {
            cardComponent = LessonFormCard;
        }

        const selected = this.props.selectedType === "lessons"
            && this.props.selectedItem === lesson.id;

        const options = {
            "activity": this.props.activity,
            "deleteClick": this.props.deleteClick,
            "editItem": this.props.editItem,
            "exercises": this.props.exercises,
            "key": lesson.id,
            "lesson": lesson,
            "itemUser": this.itemUser(lesson),
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selected": selected,
            "selectedType": this.props.selectedType,
            "startLesson": this.props.startLesson
        };

        return React.createElement(
            cardComponent,
            options,
            null
        );
    }

    exerciseFormCard(key, exercise, mediaItem) {
        var options = {
            "key": key,
            "exercise": exercise,
            "itemUser": this.itemUser(exercise),
            "media": this.props.media,
            "mediaItem": mediaItem,
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

    exerciseCard(key, queueItem, exercise, mediaItem, lessons) {

        var options = {
            "checkClick": this.props.checkClick,
            "deleteClick": this.props.deleteClick,
            "editItem": this.props.editItem,
            "exercise": exercise,
            "key": key,
            "languages": this.findLanguage(exercise),
            "mediaItem": mediaItem,
            "maxRank": this.props.maxRank(),
            "queueClick": this.props.queueClick,
            "queueItem": queueItem,
            "selectedType": this.props.selectedType,
            "startExercise": this.props.startExercise,
            "itemUser": this.itemUser(exercise),
            "lessons": lessons
        };

        return React.createElement(
            typeInfo[this.props.selectedType].card,
            options,
            null
        );
    }

    /*

        Find the user associated with the item

    */
    itemUser(item) {
        if (!this.props.users) {
            return null;
        }

        const userFieldName = typeInfo[this.props.selectedType].userField;
        const user = util.findItem(this.props.users, item[userFieldName]);

        return user;
    }

    makeElement(item) {
        var exercise;
        var mediaItem;
        var queueItem;

        if (this.props.selectedType === "media") {
            return this.mediaCard(item);
        }

        if (this.props.selectedType === "lessons") {
            return this.lessonCard(item);
        }

        if (this.props.selectedType === "queueItems") {
            queueItem = item;
            exercise = this.queueExercise(item);
        } else {
            exercise = item;
            queueItem = this.props.queueItems.find(
                (queueItem) => queueItem.exercise === item.id
            );
        }

        if (!exercise) {
            return null;
        }

        if (exercise.media) {
            mediaItem = util.findItem(this.props.media, exercise.media);
        }

        if (this.props.selectedItem === item.id) {
            if (this.props.activity === "do"
                && typeInfo[this.props.selectedType].doable) {
                return this.doCard(
                    item.id, queueItem, exercise, mediaItem
                );
            }

            if (this.props.activity === "edit") {
                return this.exerciseFormCard(item.id, exercise, mediaItem);
            }
        }
        return this.exerciseCard(
            item.id, queueItem, exercise,  mediaItem, this.props.lessons
        );
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
        return React.createElement(
            "div",
            {"className": ""},
            this.addCard(myType.addable, "initial"),
            this.makeElements(myType),
            this.addCard(myType.addable, "final")
        );
    }
}