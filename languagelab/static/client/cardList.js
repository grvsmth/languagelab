import util from "./util.js";

import ExerciseCard from "./exerciseCard.js";
import ExerciseFormCard from "./exerciseFormCard.js";
import MediaCard from "./mediaCard.js";
import MediaFormCard from "./mediaFormCard.js";

const typeInfo = {
    "media": {
        "userField": "uploader",
        "card": MediaCard,
        "formCard": MediaFormCard
    },
    "exercises": {
        "userField": "creator",
        "card": ExerciseCard,
        "formCard": ExerciseFormCard
    },
    "lessons": {
        "userField": "creator"
    },
    "queueItems": {
        "userField": "user",
        "card": ExerciseCard
    },
    "languages": {
        "userField": ""
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

    formCard(item, users) {
        var options = {
            "key": item.id,
            "item": item,
            "users": users,
            "languages": this.props.languages,
            "setActivity": this.props.setActivity,
            "saveItem": this.props.saveItem,
            "selectedType": this.props.selectedType
        };

        if (["exercises"].includes(this.props.selectedType)) {
            options["media"] = this.props.media;
        }

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
            return [
                util.findItem(this.props.languages, language)
            ];

        }
        return [];

    }

    itemCard(selection, users) {
        var item = selection;
        var queueItem = null;

        if (item.exercise) {
            let exercise = util.findItem(
                this.props.exercises, selection.exercise
                );
            if (exercise) {
                queueItem = selection;
                item = exercise;
            }
        } else {
            queueItem = this.props.queueItems.find(
                (queueItem) => queueItem.exercise === item.id
            );
        }

        var options = {
                "key": item.id,
                "item": item,
                "users": users,
                "queueItem": queueItem,
                "languages": this.findLanguage(item),
                "checkClick": this.props.checkClick,
                "deleteClick": this.props.deleteClick,
                "editItem": this.props.editItem,
                "mediaItem": null,
                "queueClick": this.props.queueClick,
                "selectedType": this.props.selectedType
        };

        if (item.media) {
            options["mediaItem"] = util.findItem(this.props.media, item.media);
        }

        return React.createElement(
            typeInfo[this.props.selectedType].card,
            options,
            null
        );
    }

    makeElement(item) {
        var users = [];
        var nextElement;

        if (this.props.users) {
            const fieldName = typeInfo[this.props.selectedType].userField;
            const user = util.findItem(this.props.users, item[fieldName]);
            if (user) {
                users.push(user);
            }
        }

        if (this.props.activity === "edit"
            && this.props.selectedItem === item.id) {
            nextElement = this.formCard(item, users);
        } else {
            nextElement = this.itemCard(item, users);
        }
        return nextElement;
    }

    makeElements() {
        return this.props[this.props.selectedType].map(this.makeElement, this);
    }

    render() {
        console.log("this.props", this.props);

        if (!this.props[this.props.selectedType].length
        || !typeInfo[this.props.selectedType].hasOwnProperty("card")) {
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
        } else {
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