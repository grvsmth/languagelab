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
            mediaElements.push(
                React.createElement(
                    MediaCard,
                    {
                        "key": mediaItem.id,
                        "mediaItem": mediaItem,
                        "checkClick": this.props.checkClick
                    },
                    null
                )
            );
        });
        return mediaElements;
    }
}