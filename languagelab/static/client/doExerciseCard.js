import commonElements from "./commonElements.js";
import config from "./config.js";
import util from "./util.js";

const playActivities = [
    "play", "playModelFirst", "playModelSecond", "playModel", "playMimic"
];

const playableActivities = playActivities + ["ready"];

export default class DoExerciseCard extends React.Component {
    constructor(props) {
        super(props);

        this.afterPlay = this.afterPlay.bind(this);
        this.handleGetInput = this.handleGetInput.bind(this);
        this.handleError = this.handleError.bind(this);
        this.mediaRecorder = null;
        this.player = React.createRef();
        this.statusColor = {
            "error": "danger",
            "warning": "warning",
            "playMimic": "success",
            "playModel": "info",
            "playModelFirst": "success",
            "playModelSecond": "success",
            "ready": "info",
            "recording": "danger"
        };

        this.state = {
            "clickedAction": "",
            "mediaStatus": "loading",
            "mimicCount": {},
            "nowPlaying": this.props.mediaItem.mediaUrl,
            "onlyExercise": true,
            "recordDisabled": true,
            "status": "ready",
            "statusText": "Ready",
            "userAudioUrl": ""
        };
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({"audio": true}).then(
            (stream) => this.handleGetInput(stream),
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

    handleGetInput(stream) {
        window.stream = stream;
        this.mediaRecorder = new window.MediaRecorder(
            stream, config.audio.options
        );
        this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this);
        this.setState({"recordDisabled": false});
    }

    handleGetMediaError(error) {
        // TODO throw error up to lab.js for alert
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
        const startMoment = new moment(startString, config.timeFormat);
        const endMoment = new moment(endString, config.timeFormat);
        const durationMoment = moment.duration(endMoment.diff(startMoment));
        return util.formatDuration(durationMoment, 3);
    }

    title(prop) {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            prop.name
        );
    }

    bySpan() {
        if (!this.props.itemUser) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-dark"},
            " by ",
            this.props.itemUser.username
        );
    }

    itemSubtitle() {
        const timeRange = util.timeRange(
            this.props.exercise.startTime,
            this.props.exercise.endTime,
            config.timeFormat
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
        if (this.state.status === "playMimic") {
            this.setState({"mediaStatus": "ready"});
            return;
        }

        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);
        console.log("loadedMetadata", this.state);
        console.log("startSeconds = ", startSeconds);

        if (startSeconds < 0) {
            return;
        }

        if (startSeconds > event.target.duration) {
            const msg = `Your startTime of ${this.props.exercise.startTime}
            seconds is greater than the total duration
            (${event.target.duration} seconds) of this media clip.`;
            this.setState({
                "statusText": msg,
                "status": "error"
            });
            return;
        }
        event.target.currentTime = startSeconds;
        if (event.target.currentTime !== startSeconds) {
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

        this.setState({"mediaStatus": "ready"});
        console.log("setting mediaStatus to ready");
    }

    afterPlay(player) {
        console.log("afterPlay", this.state);

        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);

        if (this.state.clickedAction === "mimic"
            && this.state.status === "playModelFirst") {
            this.mediaRecorder.start();
            this.setState({
                "status": "recording",
                "statusText": "Now recording"
            });
            return;
        }

        if (this.state.status === "playModelSecond") {
            if (this.state.userAudioUrl.length < 11) {
                this.setState({
                    "status": "warning",
                    "statusText": "No recorded audio found",
                });
                player.currentTime = startSeconds;
            } else {
                this.setState({
                    "mediaStatus": "loading",
                    "nowPlaying": this.state.userAudioUrl,
                    "status": "playMimic",
                    "statusText": "Now playing recorded audio"
                });
            }
            return;
        }

        if (this.state.status === "playMimic") {
            this.setState(prevState => ({
                "status": "ready",
                "statusText": "Ready",
                "clickedAction": null,
                "mimicCount": {
                    ...prevState.mimicCount,
                    [this.props.exercise.id]: this.exerciseCount() + 1
                }
            }));
            return;
        }
        player.currentTime = startSeconds;
        this.setState({"status": "ready"});
    }

    timeUpdateHandler(event) {
        console.log("timeUpdateHandler", this.state.status);
        if (this.state.status === "playModel"
            && !this.state.onlyExercise) {
            return;
        }

        if (!playActivities.includes(this.state.status)) {
            return;
        }

        const endSeconds = this.timeAsSeconds(this.props.exercise.endTime);
        if (event.target.currentTime < endSeconds) {
            return;
        }

        event.target.pause();
        this.afterPlay(event.target);
    }

    playHandler(event) {
        if (this.state.status === "ready") {
            this.setState({
                "status": "playModel",
                "statusText": "Now playing " + this.props.mediaItem.name
            });
        }
    }

    makePlayer() {
        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);
        const endSeconds = this.timeAsSeconds(this.props.exercise.endTime);

        const timeUpdateHandler = startSeconds < endSeconds
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
                this.props.exercise.id,
                this.onlyCheck.bind(this)
            )
        );
    }

    queueNav(direction) {
        this.props.queueNav[direction](this.props.rank);
    }

    navDisabled(direction) {
        if (!this.props.rank) {
            return "disabled";
        }
        if (direction === "previous") {
            return this.props.rank <= 1 ? "disabled" : null;
        }
        if (direction === "next") {
            return this.props.rank >= this.props.maxRank
                ? "disabled" : null;
        }
        return null;
    }

    navButtonElements(direction) {
        if (!this.props.queueInfo.hasOwnProperty(direction)) {
            return commonElements.iconSpan(this.props.doButton[direction].icon);
        }

        if (direction === "previous") {
            return React.createElement(
                "span",
                {},
                commonElements.iconSpan(this.props.doButton[direction].icon),
                " " + this.props.queueInfo[direction].name
            );
        }

        return React.createElement(
            "span",
            {},
            this.props.queueInfo[direction].name + " ",
            commonElements.iconSpan(this.props.doButton[direction].icon)
        );
    }

    navButton(direction) {
        if (this.props.selectedType !== "lessons") {
            return null;
        }
        const disabled = this.navDisabled(direction);
        return React.createElement(
            "button",
            {
                "type": "button",
                "onClick": () => this.queueNav(direction),
                "className": "btn btn-" + this.props.doButton[direction].color,
                "disabled": disabled
            },
            this.navButtonElements(direction)
        );
    }

    exerciseCount() {
        if(this.state.mimicCount.hasOwnProperty(this.props.exercise.id)) {
            return this.state.mimicCount[this.props.exercise.id];
        }

        return 0;
    }

    mimicCountSpan() {
        return React.createElement(
            "span",
            {"className": "badge badge-light"},
            this.exerciseCount()
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
        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);

        if (this.state.status === "recording") {
            console.log("Stop recording!");
            this.mediaRecorder.stop();
            this.setState({
                "mediaStatus": "loading",
                "status": "playModelSecond",
                "nowPlaying": this.props.mediaItem.mediaUrl,
                "statusText": "Now playing " + this.props.mediaItem.name
            });
            this.player.current.currentTime = startSeconds;

            this.player.current.play()
                .catch(this.handleError, "playModelSecond");

            return;
        }

        if (!playableActivities.includes(this.state.status)) {
            return;
        }

        const mediaStatus = this.state.nowPlaying === this.props.mediaItem.mediaUrl ?
            "ready": "loading";

        this.setState({
            "clickedAction": "mimic",
            "mediaStatus": mediaStatus,
            "status": "playModelFirst",
            "nowPlaying": this.props.mediaItem.mediaUrl,
            "statusText": "Now playing " + this.props.mediaItem.name
        });
    }

    mimicButton() {
        var colorClass = "info";
        if (this.state.clickedAction === "mimic") {
            if (this.state.status === "recording") {
                colorClass = "danger";
            } else if (playActivities.includes(
                this.state.status
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
        console.log("controls()", this.state);
        if (this.player.current) {
            console.log("paused?", this.player.current.paused);
            if (this.player.current.paused
                && this.state.mediaStatus === "ready"
                && playActivities.includes(this.state.status)
            ) {
                this.player.current.play()
                    .catch(this.handleError, this.state.status);
            }
        }
        return React.createElement(
            "div",
            {
                "className": "btn-group btn-group"
            },
            this.navButton("previous"),
            this.mimicButton(),
            this.exitButton(),
            this.navButton("next")
        );
    }

    cardHeader() {
        if (!this.props.lesson) {
            return null;
        }

        return React.createElement(
            "div",
            {"className": "card-header"},
            this.title(this.props.lesson),
            commonElements.lessonSubtitle(this.props.lesson)
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.title(this.props.exercise),
            this.itemSubtitle(),
            this.descriptionRow(),
            this.playerDiv(),
            this.statusRow(),
            this.controls()
        );
    }

    render() {
        console.log(this.props);
        return React.createElement(
            "div",
            {"className": "card bg-light mb-3"},
            this.cardHeader(),
            this.cardBody()
        );
    }
}