import commonElements from "./commonElements.js";
import util from "./util.js";


export default class DoExerciseCard extends React.Component {
    constructor(props) {
        super(props);

        this.gotInput = this.gotInput.bind(this);
        this.mediaRecorder = null;
        this.playActivities = [
            "playModelFirst", "playModelSecond", "playModel"
        ];
        this.recorderOptions = {
            "audioBitsPerSecond": 128000, "sampleRate": 48000
        };
        this.statusColor = {
            "error": "danger",
            "warning": "warning",
            "active": "success",
            "normal": "info",
            "recording": "danger"
        };
        this.timeFormat = "HH:mm:ss.S";

        this.state = {
            "clickedAction": "",
            "currentActivity": "",
            "mimicCount": 0,
            "startSeconds": this.timeAsSeconds(this.props.exercise.startTime),
            "endSeconds": this.timeAsSeconds(this.props.exercise.endTime),
            "nowPlaying": this.props.mediaItem.mediaUrl,
            "userAudioUrl": "",
            "recordDisabled": true,
            "status": "normal",
            "statusText": ""
        };
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({"audio": true}).then(
            (stream) => this.gotInput(stream),
            (error) => this.handleGetMediaError(error)
        );
    }

    onDataAvailable(event) {
        const userAudioUrl = window.URL.createObjectURL(
            event.data,
            {"type": "audio/ogg"}
        );
        this.setState({"userAudioUrl": userAudioUrl});
    }

    gotInput(stream) {
        console.log("Got input!");
        window.stream = stream;
        this.mediaRecorder = new window.MediaRecorder(
            stream, this.recorderOptions
        );
        this.setState({"recordDisabled": false});
    }

    handleGetMediaError(error) {
        if (error.code === 8) {
            this.setState({
                "statusText": "Unable to find a recording device!",
                "status": "warning"
            });
            return;
        }
        this.setState({
            "statusText": `getUserMedia(): ${error.message}`,
            "status": "error"
        });
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
        if (this.props.languages
            && this.props.languages.length && this.props.languages[0]) {
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
            " – ",
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

    loadedMetadata(event) {
        if (this.state.startSeconds <= 0) {
            return;
        }

        if (this.state.startSeconds > event.target.duration) {
            const msg = `Your startTime of ${this.props.exercise.startTime}
            seconds is greater than the total duration
            (${event.target.duration} seconds) of this media clip.`;
            this.setState({
                "statusText": msg,
                "status": "error"
            });
            return;
        }
        if (this.state.nowPlaying === this.props.mediaItem.mediaUrl) {
            event.target.currentTime = this.state.startSeconds;
            if (event.target.currentTime !== this.state.startSeconds) {
                const msg = `Unable to set start time.  You may need to use a
                different browser or host your media on a server that supports <a
                target="_blank"
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests"
                >byte-range requests</a>.`;
                this.setState({
                    "statusText": msg,
                    "status": "error"
                });
                return;
            }
        }

        if (this.playActivities.includes(this.state.currentActivity)) {
            event.target.play();
        }

    }

    setActivity(activityName) {
        this.setState({"activity": activityName});
    }

    afterPlay() {
        this.setState({"statusText": "afterPlay()"});
    }

    timeUpdateHandler(event) {
        if (this.playActivities.includes(this.state.activity)
            && event.target.currentTime >= this.state.endSeconds) {
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
                "onLoadedMetadata": this.loadedMetadata.bind(this),
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

    handleError(error, action="unknown") {
        this.setState({
            "statusText": action + ": " + error.message,
            "status": "error"
        });
    }

    mimicClick(event) {
        if (this.state.currentActivity === "recording") {
            console.log("Stop recording!");
            this.mediaRecorder.stop();
            this.setState({
                "currentActivity": "playModelSecond",
                "nowPlaying": this.props.mediaItem.mediaUrl,
                "statusText": "Now playing " + this.props.mediaItem.name
            });
        }

        this.setState({
            "clickedAction": "mimic",
            "currentActivity": "playModelFirst",
            "nowPlaying": this.props.mediaItem.mediaUrl,
            "statusText": "Now playing " + this.props.mediaItem.name,
            "status": "active"
        });
    }

    mimicButton() {
        var colorClass = "info";
        if (this.state.clickedAction === "mimic") {
            if (this.state.currentActivity === "recording") {
                colorClass = "danger";
            } else if (this.playActions.includes(this.state.currentActivity)) {
                colorClass = "success";
            }
        }
        const className = "btn btn-" + colorClass;
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": className,
                "disabled": this.state.recordDisabled,
                "onClick": this.mimicClick.bind(this)
            },
            "Mimic ",
            this.mimicCountSpan()
        );
    }

    downloadButton() {
        const disabled = this.state.userAudioUrl.length < 11;
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-info",
                "disabled": disabled,
                "href": this.state.userAudioUrl
            },
            "Download"
        );
    }

    statusRow() {
        return React.createElement(
            "div",
            {"className": "text-" + this.statusColor[this.state.status]},
            this.state.statusText
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
            this.downloadButton(),
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
            this.statusRow(),
            this.controls()
        );
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