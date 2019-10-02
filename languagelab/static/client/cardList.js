import util from "./util.js";

import ExerciseCard from "./exerciseCard.js";
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
        "card": ExerciseCard
    },
    "lessons": {
        "userField": "creator"
    },
    "queueItems": {
        "userField": "user"
    },
    "languages": {
        "userField": ""
    }
};

export default class CardList extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
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
        return React.createElement(
            typeInfo[this.props.selectedType].formCard,
            {
                "key": item.id,
                "item": item,
                "users": users,
                "languages": this.props.languages,
                "setActivity": this.props.setActivity,
                "saveItem": this.props.saveItem
            },
            null
        );
    }

    makeElements() {
        console.log("this.props", this.props);

        return this.props.itemList.map((item) => {
            var users = [];
            var languageList = [];
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
                if (this.props.languages) {
                    let language = util.findItem(
                        this.props.languages, item.language
                        );
                    if (language) {
                        languageList.push(language);
                    }
                }

                nextElement = React.createElement(
                    typeInfo[this.props.selectedType].card,
                    {
                        "key": item.id,
                        "item": item,
                        "users": users,
                        "languages": languageList,
                        "checkClick": this.props.checkClick,
                        "deleteClick": this.props.deleteClick,
                        "editItem": this.props.editItem
                    },
                    null
                );
            }
            return nextElement;
        });
    }

    render() {
        if (!this.props.itemList.length
        || !typeInfo[this.props.selectedType].hasOwnProperty("card")) {
            return React.createElement(
                "div",
                {"className": "card"},
                `Ready to start displaying ${this.props.selectedType}`
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

        elements = elements.concat(this.makeElements());
        return elements;
    }
}