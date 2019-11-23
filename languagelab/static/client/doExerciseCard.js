import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";


export default class DoExerciseCard extends React.Component {
    constructor(props) {
        super(props);

        this.timeFormat = "HH:mm:ss.S";

        this.state = {
            "startSeconds": this.timeAsSeconds(this.props.item.startTime),
            "endSeconds": this.timeAsSeconds(this.props.item.endTime),
            "duration": this.duration(
                this.props.item.startTime,
                this.props.item.endTime
                ),
            "nowPlaying": this.props.mediaItem.mediaUrl
        };
    }

    timeAsSeconds(timeString) {
        return moment.duration(timeString).asSeconds();
    }

    duration(startString, endString) {
        const startMoment = new moment(startString, this.timeFormat);
        const endMoment = new moment(endString, this.timeFormat);
        const durationMoment = moment.duration(endMoment.diff(startMoment));
        return util.formatDuration(durationMoment, 3);
    }

    itemTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.item.name
        );
    }

    bySpan() {
        if (!this.props.users) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-dark"},
            " by ",
            this.props.users[0].username
        );
    }

    itemSubtitle() {
        const timeRange = util.timeRange(
            this.props.item.startTime,
            this.props.item.endTime,
            this.timeFormat
        );

        var mediaName = "";
        if (this.props.mediaItem) {
            mediaName = this.props.mediaItem.name + ", ";

        }

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-muted"},
            mediaName,
            timeRange
        );
    }

    descriptionRow() {
        var languageText = "";
        if (this.props.languages && this.props.languages.length && this.props.languages[0]) {
            languageText = this.props.languages[0].name + ", ";
        }

        var mediaCreator = "";
        if (this.props.mediaItem) {
            mediaCreator = this.props.mediaItem.creator;
        }

        return React.createElement(
            "div",
            {},
            languageText,
            mediaCreator,
            ": ",
            this.props.item.description
        );
    }

    textDiv(fieldName, options={}) {
        return React.createElement(
            "div",
            options,
            this.props.item[fieldName]
        );
    }

    setStartTime(event) {
        if (this.state.startSeconds <= 0) {
            return;
        }

        if (this.state.startSeconds > event.target.duration) {
            const msg = `Your startTime of ${this.props.item.startTime}
            seconds is greater than
            the total duration (${event.target.duration} seconds) of this media clip.`;
            console.error(msg);
        }
        if (this.state.nowPlaying === this.props.mediaItem.mediaUrl) {
            event.target.currentTime = this.state.startSeconds;
            if (event.target.currentTime !== this.state.startSeconds) {
                const msg = `Unable to set start time.  You may need to use a
                different browser or host your media on a server that supports <a
                target="_blank"
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests"
                >byte-range requests</a>.`;
                console.error(msg);
            }
        }

    }

    player() {
        return React.createElement(
            "audio",
            {
                "id": "audio1",
                "src": this.state.nowPlaying,
                "controls": true,
                "onLoadedMetadata": this.setStartTime.bind(this),
                "style": {
                    "width": "100%"
                }
            },
            null
        );

    }

    playerDiv() {
        return React.createElement(
            "div",
            {"className": ""},
            this.player()
        );
    }

    controls() {
        return React.createElement(
            "div",
            {},
            "Controls will go here"
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            this.itemSubtitle(),
            this.descriptionRow(),
            this.playerDiv(),
            this.controls()
        );
    }

    cardFooter() {
    }

    render() {
        console.log("props", this.props);
        return React.createElement(
            "div",
            {"className": "card bg-light"},
            this.cardBody()
        );
    }
}