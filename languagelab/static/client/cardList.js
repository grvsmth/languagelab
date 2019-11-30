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

    doCard(key, queueItem, exercise, mediaItem, users) {
        var options = {
                "key": key,
                "exercise": exercise,
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

    mediaCard(mediaItem, users) {
        console.log("mediaCard", mediaItem);
        const cardComponent = this.props.activity === "edit"
            && this.props.selectedItem === mediaItem.id
            ? MediaFormCard : MediaCard;
        return React.createElement(
            cardComponent,
            {
                "checkClick": this.props.checkClick,
                "deleteClick": this.props.deleteClick,
                "editItem": this.props.editItem,
                "id": mediaItem.id,
                "key": mediaItem.id,
                "languages": this.props.languages,
                "mediaItem": mediaItem,
                "setActivity": this.props.setActivity,
                "users": users
            },
            null
        );
    }

    exerciseFormCard(key, exercise, mediaItem, users) {
        // TODO doesn't provide form in queue list
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

    maxRank() {
        if (this.props.queueItems.length < 1) {
            return 0;
        }

        const last = this.props.queueItems[this.props.queueItems.length - 1];
        return last.rank;
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
            "maxRank": this.maxRank(),
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

    makeElement(item) {
        var exercise;
        var mediaItem;
        var queueItem;
        var users = [];

        if (this.props.users) {
            // Find user associated with the item
            // TODO find current user
            const userFieldName = typeInfo[this.props.selectedType].userField;
            const user = util.findItem(this.props.users, item[userFieldName]);
            if (user) {
                users.push(user);
            }
        }

        if (this.props.selectedType === "media") {
            return this.mediaCard(item, users);
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

    initialAddCard(addable) {
        if (this.props.activity === "add") {
            // TODO return MediaFormCard or this.exerciseFormCard
            return this.exerciseFormCard("form", this.props.users[0]);
        }

        if (addable) {
            return this.addButtonCard();
        }
        return null;
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
                `No ${this.props.selectedType} loaded`
            );
        }


        return React.createElement(
            "div",
            {"className": "card-columns"},
            this.initialAddCard(myType.addable),
            this.makeElements()
        );
    }
}