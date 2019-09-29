import util from "./util.js";

import MediaCard from "./mediaCard.js";
import MediaFormCard from "./mediaFormCard.js";

export default class MediaCardList extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }


    render() {
        if (!this.props.media) {
            return null;
        }

        const mediaElements = [];

        this.props.media.forEach((mediaItem) => {
            var users = [];
            var languageList = [];
            var nextElement;

            if (this.props.users) {
                users.push(util.findItem(this.props.users, mediaItem.uploader));
            }

            if (this.props.activity === "edit") {
                nextElement = React.createElement(
                    MediaFormCard,
                    {
                        "key": mediaItem.id,
                        "mediaItem": mediaItem,
                        "users": users,
                        "languages": this.props.languages,
                        "setActivity": this.props.setActivity
                    },
                    null
                );
            } else {
                if (this.props.languages) {
                    languageList.push(
                        util.findItem(this.props.languages, mediaItem.language)
                    );
                }

                nextElement = React.createElement(
                    MediaCard,
                    {
                        "key": mediaItem.id,
                        "mediaItem": mediaItem,
                        "users": users,
                        "languages": languageList,
                        "checkClick": this.props.checkClick,
                        "setActivity": this.props.setActivity,
                        "deleteClick": this.props.deleteClick
                    },
                    null
                );
            }
            mediaElements.push(nextElement);
        });
        return mediaElements;
    }
}