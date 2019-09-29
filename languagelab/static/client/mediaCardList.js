import util from "./util.js";

import MediaCard from "./mediaCard.js";

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
            if (this.props.users) {
                users.push(util.findItem(this.props.users, mediaItem.uploader));
            }

            mediaElements.push(
                React.createElement(
                    MediaCard,
                    {
                        "key": mediaItem.id,
                        "mediaItem": mediaItem,
                        "users": users,
                        "checkClick": this.props.checkClick
                    },
                    null
                )
            );
        });
        return mediaElements;
    }
}