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
        /*
            listDiv.append(
                React.createElement(
                    MediaCard,
                    {"mediaItem": this.props.media[0]},
                    null
                )
            );
*/
        this.props.media.forEach((mediaItem) => {
            mediaElements.push(
                React.createElement(
                    MediaCard,
                    {"mediaItem": mediaItem, "key": mediaItem.id},
                    null
                )
            );
        });
        return mediaElements;
    }
}