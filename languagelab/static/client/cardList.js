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

    doCard(key, queueItem, exercise, mediaItem, users) {
        var options = {
            "doButton": this.props.doButton,
            "key": key,
            "exercise": exercise,
            "exitClick": this.props.exitDo,
            "users": users,
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

    mediaCard(mediaItem, users) {
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
                "users": users
            },
            null
        );
    }

    lessonCard(lesson, users) {
        var cardComponent = LessonCard;

        if (this.props.activity === "edit"
            && this.props.selectedItem === lesson.id) {
            cardComponent = LessonFormCard;
        }

        if (this.props.activity === "add" && typeof lesson.id !== "number") {
            cardComponent = LessonFormCard;
        }

        const options = {
            "editItem": this.props.editItem,
            "key": lesson.id,
            "lesson": lesson,
            "users": users,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selectedType": this.props.selectedType
        };

        return React.createElement(
            cardComponent,
            options,
            null
        );
    }

    exerciseFormCard(key, exercise, mediaItem, users) {
        var options = {
            "key": key,
            "exercise": exercise,
            "users": users,
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

    exerciseCard(key, queueItem, exercise, mediaItem, users) {

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
            "users": users
        };

        return React.createElement(
            typeInfo[this.props.selectedType].card,
            options,
            null
        );
    }

    makeUsers(item) {
        var users = [];

        if (this.props.users) {
            const userFieldName = typeInfo[this.props.selectedType].userField;
            const userId = item[userFieldName];

            const user = util.findItem(this.props.users, userId);
            if (user) {
                users.push(user);
            }

            if (this.props.currentUser && this.props.currentUser.id != userId) {
                users.push(this.props.currentUser)
            }
        }
        return users;
    }

    makeElement(item) {
        var exercise;
        var mediaItem;
        var queueItem;

        const users = this.makeUsers(item);

        if (this.props.selectedType === "media") {
            return this.mediaCard(item, users);
        }

        if (this.props.selectedType === "lessons") {
            return this.lessonCard(item, users);
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
                    item.id, queueItem, exercise, mediaItem, users
                );
            }

            if (this.props.activity === "edit") {
                return this.exerciseFormCard(
                    item.id, exercise, mediaItem, users
                );
            }
        }
        return this.exerciseCard(item.id, queueItem, exercise,  mediaItem, users);
    }

    addCard(addable, cardId="form") {
        if (cardId === "initial" && !this.props[this.props.selectedType].length) {
            return null;
        }

        if (this.props.activity === "add") {
            if (this.props.selectedItem === cardId) {
                if (this.props.selectedType === "media") {
                    return this.mediaCard({"id": cardId}, [this.props.users[0]])
                }

                if (this.props.selectedType === "lessons") {
                    return this.lessonCard(
                        {"id": cardId}, [this.props.users[0]]
                    );
                }

                return this.exerciseFormCard(
                    cardId,
                    {"id": cardId},
                    null,
                    this.props.users[0]
                );
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