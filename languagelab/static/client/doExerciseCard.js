import commonElements from "./commonElements.js";
import config from "./config.js";
import util from "./util.js";

const playActivities = [
    "playModelFirst", "playModelSecond", "playModel", "playMimic"
];

const playableActivities = playActivities + ["ready"];

const activeStatuses = playActivities + ["recording"];

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

    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({"audio": true}).then(
            (stream) => this.handleGetInput(stream),
            (error) => this.handleGetMediaError(error)
        );
    }

    onDataAvailable(event) {
        console.log("onDataAvailable", event);
        const userAudioUrl = window.URL.createObjectURL(
            event.data,
            {"type": "audio/ogg"}
        );
        this.props.setUserAudioUrl(userAudioUrl);
    }

    handleGetInput(stream) {
        window.stream = stream;
        this.mediaRecorder = new window.MediaRecorder(
            stream, config.audio.options
        );
        this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this);
    }

    handleGetMediaError(error) {
        // TODO throw error up to lab.js for alert
        if (error.code === 8) {
            this.props.setStatus({
                "statusText": "Unable to find a recording device!",
                "status": "warning"
            });
            return;
        }
        this.props.setStatus({
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

    setStartTime(player) {
        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);
        console.log("startSeconds = ", startSeconds);

        if (startSeconds < 0) {
            return;
        }

        if (startSeconds > player.duration) {
            const msg = `Your startTime of ${this.props.exercise.startTime}
            seconds is greater than the total duration
            (${player.duration} seconds) of this media clip.`;
            this.props.setStatus({
                "statusText": msg,
                "status": "error"
            });
            return;
        }
        player.currentTime = startSeconds;
        if (player.currentTime !== startSeconds) {
            const msg = `Unable to set start time.  You may need to use a
            different browser or host your media on a server that supports <a
            target="_blank"
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests"
            >byte-range requests</a>.`;
            this.props.setStatus({
                "statusText": msg,
                "status": "error"
            });
        }
    }

    loadedMetadata(event) {
        console.log("loadedMetadata()", event);

        if (this.props.state.status === "playMimic") {
            this.player.current.play();
            return;
        }

        console.log("loadedMetadata", this.props.state);
        this.setStartTime(event.target);

        this.props.onMediaLoaded();

        if (playActivities.includes(this.props.state.status)) {
            this.player.current.play();
            return;
        }

    }

    afterPlay(player) {
        console.log("afterPlay", this.props.state);

        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);

        if (this.props.state.clickedAction === "mimic"
            && this.props.state.status === "playModelFirst") {
            this.mediaRecorder.start();
            this.props.setStatus({
                "status": "recording",
                "statusText": "Now recording"
            });
            return;
        }

        if (this.props.state.status === "playModelSecond") {
            if (this.props.state.userAudioUrl.length < 11) {
                this.props.setStatus({
                    "status": "warning",
                    "statusText": "No recorded audio found",
                });
                player.currentTime = startSeconds;
            } else {
                this.props.playMimic();
            }
            return;
        }

        if (this.props.state.status === "playMimic") {
            this.props.afterMimic(this.exerciseCount());
            return;
        }
        player.currentTime = startSeconds;
    }

    timeUpdateHandler(event) {
        console.log("timeUpdateHandler", this.props.state.status);
        if (this.props.state.status === "playModel"
            && !this.props.state.onlyExercise) {
            return;
        }

        if (!playActivities.includes(this.props.state.status)) {
            return;
        }

        const endSeconds = this.timeAsSeconds(this.props.exercise.endTime);
        if (event.target.currentTime < endSeconds) {
            return;
        }

        event.target.pause();
        this.afterPlay(event.target);
    }

    setPlayingMessage() {
        if (this.props.state.nowPlaying === this.props.mediaItem.mediaUrl) {
            this.props.setStatus({
                "status": "playModel",
                "statusText": "Now playing " + this.props.mediaItem.name
            });
            return;
        }

        this.props.setStatus({
            "status": "playMimic",
            "statusText": "Now playing recorded audio"
        });
    }

    playHandler(event) {
        if (this.props.state.status === "ready") {
            this.setPlayingMessage();
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
                "src": this.props.state.nowPlaying,
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
        this.props.toggleOnlyExercise(event.target.checked);
    }

    playerDiv() {
        return React.createElement(
            "div",
            {"className": "d-flex flex-row mt-3"},
            this.makePlayer(),
            commonElements.checkboxDiv(
                "onlyExercise",
                this.props.state.onlyExercise,
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
        if (activeStatuses.includes(this.props.state.status)) {
            return "disabled";
        }

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

        const nameText = util.truncateString(
            this.props.queueInfo[direction].name,
            config.exerciseNameLimit
        );

        if (direction === "previous") {
            return React.createElement(
                "span",
                {},
                commonElements.iconSpan(this.props.doButton[direction].icon),
                " " + nameText
            );
        }

        return React.createElement(
            "span",
            {},
            nameText + " ",
            commonElements.iconSpan(this.props.doButton[direction].icon)
        );
    }

    navButton(direction) {
        if (this.props.state.selectedType !== "lessons") {
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
        if(this.props.state.mimicCount.hasOwnProperty(this.props.exercise.id)) {
            return this.props.state.mimicCount[this.props.exercise.id];
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
        this.props.setStatus({
            "statusText": action + ": " + error.message,
            "status": "error"
        });
    }

    mimicClick(event) {
        console.log("mimicClick()", this.props.state);
        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);

        if (this.props.state.status === "recording") {
            console.log("Stop recording!");
            this.mediaRecorder.stop();
            this.props.playModel("Second");
            this.player.current.currentTime = startSeconds;

            this.player.current.play()
                .catch(this.handleError, "playModelSecond");

            return;
        }

        if (!playableActivities.includes(this.props.state.status)) {
            return;
        }
        this.props.playModel("First");
    }

    mimicButton() {
        const mimicDisabled = playActivities.includes(
            this.props.state.status
        );

        var colorClass = "info";
        if (this.props.state.clickedAction === "mimic") {
            if (this.props.state.status === "recording") {
                colorClass = "danger";
            } else if (playActivities.includes(
                this.props.state.status
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
                "disabled": mimicDisabled,
                "onClick": this.mimicClick.bind(this)
            },
            "Mimic ",
            this.mimicCountSpan()
        );
    }

    downloadButton() {
        const disabled = this.props.state.userAudioUrl.length < 11;
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-info",
                "disabled": disabled,
                "href": this.props.state.userAudioUrl
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
            {"className": "text-" + this.statusColor[this.props.state.status]},
            this.props.state.statusText
        );
    }

    controls() {
        if (this.player.current) {
            console.log("paused?", this.player.current.paused);
            if (this.player.current.paused
                && this.props.state.mediaStatus === "ready"
                && playActivities.includes(this.props.state.status)
            ) {
                this.player.current.play()
                    .catch(this.handleError, this.props.state.status);
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