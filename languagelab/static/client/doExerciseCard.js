import commonElements from "./commonElements.js";
import util from "./util.js";


export default class DoExerciseCard extends React.Component {
    constructor(props) {
        super(props);

        this.setActivity = this.setActivity.bind(this);
        this.timeFormat = "HH:mm:ss.S";

        this.state = {
            "mimicCount": 0,
            "startSeconds": this.timeAsSeconds(this.props.exercise.startTime),
            "endSeconds": this.timeAsSeconds(this.props.exercise.endTime),
            "nowPlaying": this.props.mediaItem.mediaUrl,
            "recordDisabled": true
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
            this.props.exercise.name
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
            this.props.exercise.startTime,
            this.props.exercise.endTime,
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
            this.props.exercise.description
        );
    }

    textDiv(fieldName, options={}) {
        return React.createElement(
            "div",
            options,
            this.props.exercise[fieldName]
        );
    }

    setStartTime(event) {
        if (this.state.startSeconds <= 0) {
            return;
        }

        if (this.state.startSeconds > event.target.duration) {
            const msg = `Your startTime of ${this.props.exercise.startTime}
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

    setActivity(activityName) {
        this.setState({"activity": activityName});
    }

    afterPlay() {
        console.log("afterPlay()");
    }

    timeUpdateHandler(event) {
        if (["playModelFirst", "playModelSecond", "playModel"].includes(
            this.state.activity
            ) && event.target.currentTime >= this.state.endSeconds) {
            event.target.pause();
            this.afterPlay();
        }
    }

    player() {
        console.log(this.state);
        const timeUpdateHandler = this.state.startSeconds < this.state.endSeconds
            ? this.timeUpdateHandler.bind(this) : null;

        return React.createElement(
            "audio",
            {
                "id": "audio1",
                "src": this.state.nowPlaying,
                "controls": true,
                "onLoadedMetadata": this.setStartTime.bind(this),
                "onPlay": () => {this.setActivity("playModel")},
                "onTimeUpdate": timeUpdateHandler,
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

    queueNav(direction) {
        this.props.queueNav[direction](this.props.queueItem.rank);
    }

    navDisabled(direction) {
        if (direction === "previous") {
            return this.props.queueItem.rank <= 1 ? "disabled" : null;
        }
        if (direction === "next") {
            return this.props.queueItem.rank >= this.props.maxRank
                ? "disabled" : null;
        }
        return null;
    }

    navButton(direction) {
        const disabled = this.navDisabled(direction);
        return React.createElement(
            "button",
            {
                "type": "button",
                "onClick": () => this.queueNav(direction),
                "className": "btn btn-" + this.props.doButton[direction].color,
                "disabled": disabled
            },
            commonElements.iconSpan(this.props.doButton[direction].icon)
        );
    }

    mimicCountSpan() {
        return React.createElement(
            "span",
            {"className": "badge badge-light"},
            this.state.mimicCount
        );
    }

    mimicButton() {
        const className = "btn btn-success";
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": className,
                "disabled": this.state.recordDisabled
            },
            "Mimic ",
            this.mimicCountSpan()
        );
    }

    controls() {
        return React.createElement(
            "div",
            {
                "className": "btn-group btn-group-sm"
            },
            this.navButton("previous"),
            this.mimicButton(),
            this.navButton("next")
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