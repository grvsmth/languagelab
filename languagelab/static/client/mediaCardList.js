import util from "./util.js";

import MediaCard from "./mediaCard.js";
import MediaFormCard from "./mediaFormCard.js";

export default class MediaCardList extends React.Component {
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
            "Add media item"
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
                "loading": this.props.loading.media
            },
            this.addButtonCardBody()
        );
    }

    mediaFormCard(mediaItem, users) {
        var mediaId = "form";
        if (mediaItem.hasOwnProperty("id")) {
            mediaId = mediaItem.id;
        }

        return React.createElement(
            MediaFormCard,
            {
                "key": mediaId,
                "mediaItem": mediaItem,
                "users": users,
                "languages": this.props.languages,
                "setActivity": this.props.setActivity,
                "saveItem": this.props.saveItem
            },
            null
        );
    }

    makeElements() {
        return this.props.media.map((mediaItem) => {
            var users = [];
            var languageList = [];
            var nextElement;

            if (this.props.users) {
                const user = util.findItem(this.props.users, mediaItem.uploader);
                if (user) {
                    users.push(user);
                }
            }

            if (this.props.activity === "edit"
                && this.props.selectedItem === mediaItem.id) {
                nextElement = this.mediaFormCard(mediaItem, users);
            } else {
                if (this.props.languages) {
                    let language = util.findItem(
                        this.props.languages, mediaItem.language
                        );
                    if (language) {
                        languageList.push(language);
                    }
                }

                nextElement = React.createElement(
                    MediaCard,
                    {
                        "key": mediaItem.id,
                        "mediaItem": mediaItem,
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
        if (!this.props.media) {
            return null;
        }

        var mediaElements = [];

        if (this.props.activity === "add") {
            // TODO retrieve current user
            mediaElements.push(
                this.mediaFormCard({}, this.props.users[0])
            );
        } else {
            mediaElements.push(
                this.addButtonCard()
            );
        }

        mediaElements = mediaElements.concat(this.makeElements());
        return mediaElements;
    }
}