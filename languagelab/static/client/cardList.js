import util from "./util.js";

import ExerciseCard from "./exerciseCard.js";
import DoExerciseCard from "./doExerciseCard.js";
import ExerciseFormCard from "./exerciseFormCard.js";
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
    }

    addClick() {
        this.props.setActivity("add");
    }

    addButtonElement() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-primary",
                "onClick": this.addClick.bind(this)
            },
            `Add ${this.props.selectedType} item`
        );
    }

    addButtonCardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.addButtonElement()
        );
    }

    addButtonCard() {
        return React.createElement(
            "div",
            {
                "className": "card",
                "key": "addButton",
                "loading": this.props.loading
            },
            this.addButtonCardBody()
        );
    }

    formCard(exercise, mediaItem, users) {
        var options = {
            "key": exercise.id,
            "item": exercise,
            "users": users,
            "mediaItem": mediaItem,
            "languages": this.props.languages,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selectedType": this.props.selectedType
        };

        return React.createElement(
            typeInfo[this.props.selectedType].formCard,
            options,
            null
        );
    }

    findLanguage(item) {
        if (!this.props.languages) {
            return [];
        }

        var language = "";
        if (item.language) {
            language = item.language;
        }
        if (language && typeof language !== "undefined") {
            return [util.findItem(this.props.languages, language)];
        }

        return [];
    }

    queueExercise(selection) {
        if (!selection.exercise) {
            return null;
        }
        return util.findItem(this.props.exercises, selection.exercise);
    }

    doCard(queueItem, exercise, mediaItem, users) {
        var options = {
                "key": exercise.id,
                "item": exercise,
                "users": users,
                "queueItem": queueItem,
                "languages": this.findLanguage(exercise),
                "mediaItem": mediaItem,
                "selectedType": this.props.selectedType
        };

        return React.createElement(
            DoExerciseCard,
            options,
            null
        );
    }

    itemCard(queueItem, exercise, mediaItem, users) {

        var options = {
            "key": exercise.id,
            "item": exercise,
            "users": users,
            "queueItem": queueItem,
            "languages": this.findLanguage(exercise),
            "checkClick": this.props.checkClick,
            "deleteClick": this.props.deleteClick,
            "editItem": this.props.editItem,
            "startExercise": this.props.startExercise,
            "mediaItem": mediaItem,
            "queueClick": this.props.queueClick,
            "selectedType": this.props.selectedType
        };

        return React.createElement(
            typeInfo[this.props.selectedType].card,
            options,
            null
        );
    }

    makeElement(item) {
        var users = [];
        var nextElement;
        var exercise;
        var queueItem;
        var mediaItem;

        if (this.props.users) {
            const fieldName = typeInfo[this.props.selectedType].userField;
            const user = util.findItem(this.props.users, item[fieldName]);
            if (user) {
                users.push(user);
            }
        }

        if (this.props.selectedType === "queueItems") {
            queueItem = item;
            exercise = this.queueExercise(item);
        } else {
            exercise = item;
            queueItem = exercise ? item : this.props.queueItems.find(
                (queueItem) => queueItem.exercise === item.id
            );
        }

        if (!exercise) {
            return null;
        }

        if (exercise && exercise.media) {
            mediaItem = util.findItem(this.props.media, exercise.media);
        }

        if (this.props.selectedItem === item.id) {
            console.log("typeInfo", typeInfo[this.props.selectedType])
            if (this.props.activity === "edit") {
                nextElement = this.formCard(exercise, mediaItem, users);
            } else if (this.props.activity === "do" && typeInfo[this.props.selectedType].doable) {
                nextElement = this.doCard(
                    queueItem, exercise, mediaItem, users
                );
            } else {
                nextElement = this.itemCard(
                    queueItem, exercise, mediaItem, users
                );
            }
        } else {
            nextElement = this.itemCard(queueItem, exercise,  mediaItem, users);
        }
        return nextElement;
    }

    makeElements() {
        return this.props[this.props.selectedType].map(this.makeElement, this);
    }

    render() {
        console.log("this.props", this.props);

        const myType = typeInfo[this.props.selectedType];
        if (!this.props[this.props.selectedType].length
            || !myType.hasOwnProperty("card")) {
            return React.createElement(
                "div",
                {"className": "card"},
                `No ${this.props.selectedType} found`
            );
        }

        var elements = [];

        if (this.props.activity === "add") {
            // TODO retrieve current user
            elements.push(
                this.formCard({"id": "form"}, this.props.users[0])
            );
        } else if (myType.addable) {
            elements.push(
                this.addButtonCard()
            );
        }

        return React.createElement(
            "div",
            {"className": "card-columns"},
            elements.concat(this.makeElements())
        );
    }
}