import commonElements from "./commonElements.js";
import util from "./util.js";


export default class DoExerciseCard extends React.Component {
    constructor(props) {
        super(props);

        this.afterPlay = this.afterPlay.bind(this);
        this.gotInput = this.gotInput.bind(this);
        this.handleError = this.handleError.bind(this);
        this.mediaRecorder = null;
        this.playActivities = [
            "playModelFirst", "playModelSecond", "playModel", "playMimic"
        ];
        this.player = React.createRef();
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
            "currentActivity": "inactive",
            "endSeconds": this.timeAsSeconds(this.props.exercise.endTime),
            "mimicCount": 0,
            "nowPlaying": this.props.mediaItem.mediaUrl,
            "onlyExercise": true,
            "recordDisabled": true,
            "startSeconds": this.timeAsSeconds(this.props.exercise.startTime),
            "status": "normal",
            "statusText": "",
            "userAudioUrl": ""
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
        window.stream = stream;
        this.mediaRecorder = new window.MediaRecorder(
            stream, this.recorderOptions
        );
        this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this);
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
        if (this.state.startSeconds < 0) {
            return;
        }

        if (this.state.nowPlaying === this.props.mediaItem.mediaUrl) {
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
            event.target.play().catch(this.handleError, this.state.currentActivity);
        }
    }

    afterPlay(player) {
        console.log("afterPlay");
        if (this.state.clickedAction === "mimic"
            && this.state.currentActivity === "playModelFirst") {
            this.mediaRecorder.start();
            this.setState({
                "currentActivity": "recording",
                "statusText": "Now recording"
            });
            return;
        }

        if (this.state.currentActivity === "playModelSecond") {
            if (this.state.userAudioUrl.length < 11) {
                this.setState({
                    "currentActivity": "inactive",
                    "clickedAction": null,
                    "statusText": "No recorded audio found",
                    "status": "warning"
                });
                player.currentTime = this.state.startSeconds;
            } else {
                this.setState({
                    "nowPlaying": this.state.userAudioUrl,
                    "currentActivity": "playMimic",
                    "statusText": "Now playing recorded audio"
                });
            }
            return;
        }

        if (this.state.currentActivity === "playMimic") {
            this.setState({
                "currentActivity": "inactive",
                "statusText": "",
                "clickedAction": null,
                "mimicCount": this.state.mimicCount + 1
            });
            return;
        }
        player.currentTime = this.state.startSeconds;
    }

    timeUpdateHandler(event) {
        console.log(this.state);
        if (!this.state.onlyExercise) {
            return;
        }
        if (!this.playActivities.includes(this.state.currentActivity)) {
            return;
        }
        if (event.target.currentTime < this.state.endSeconds) {
            return;
        }

        event.target.pause();
        this.afterPlay(event.target);
    }

    playHandler(event) {
        if (this.state.currentActivity === "inactive") {
            console.log("Setting activity");
            this.setState({"currentActivity": "playModel"});
        }
    }

    makePlayer() {
        const timeUpdateHandler = this.state.startSeconds < this.state.endSeconds
            ? this.timeUpdateHandler.bind(this) : null;

        return React.createElement(
            "audio",
            {
                "id": "audio1",
                "ref": this.player,
                "src": this.state.nowPlaying,
                "controls": true,
                "onEnded": this.afterPlay,
                "onLoadedMetadata": this.loadedMetadata.bind(this),
                "onPlay": this.playHandler.bind(this),
                "onTimeUpdate": timeUpdateHandler,
                "style": {
                    "width": "70%"
                }
            },
            null
        );
    }

    onlyCheck(event) {
        this.setState({"onlyExercise": event.target.checked})
    }

    playerDiv() {
        return React.createElement(
            "div",
            {"className": "d-flex flex-row mt-3"},
            this.makePlayer(),
            commonElements.checkboxDiv(
                "onlyExercise",
                this.state.onlyExercise,
                "Play only this exercise",
                this.props.exercise.id
            )
        );
    }

    queueNav(direction) {
        this.props.queueNav[direction](this.props.queueItem.rank);
    }

    navDisabled(direction) {
        if (!this.props.queueItem) {
            return "disabled";
        }
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
        console.error(error);
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
            this.player.current.currentTime = this.state.startSeconds;

            this.player.current.play()
                .catch(this.handleError, "playModelSecond");

            return;
        }

        if (this.state.nowPlaying === this.props.mediaItem.mediaUrl) {
            this.player.current.play().catch(this.handleError, "mimicButtonClick");
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
            } else if (this.playActivities.includes(
                this.state.currentActivity
            )) {
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

    exitButton() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-info",
                "onClick": this.props.exitClick
            },
            commonElements.iconSpan("oi-circle-x")
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
            this.exitButton(),
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
        console.log("state", this.state);
        return React.createElement(
            "div",
            {"className": "card bg-light mb-3"},
            this.cardBody()
        );
    }
}