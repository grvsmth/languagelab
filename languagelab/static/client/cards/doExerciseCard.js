/**
 * Card for performing exercises in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global moment, React, PropTypes

*/
import commonElements from "./commonElements.js";
import config from "./config.js";
import util from "./util.js";

const playActivities = [
    "playModelFirst", "playModelSecond", "playModelOnly", "playMimic"
];

const playableActivities = playActivities + ["ready"];
const activeStatuses = playActivities + ["recording"];

const statusColor = {
    "error": "danger",
    "warning": "warning",
    "playMimic": "success",
    "playModelOnly": "info",
    "playModelFirst": "success",
    "playModelSecond": "success",
    "ready": "info",
    "recording": "danger"
};

/** Card for performing exercises in the LanguageLab client */
export default class DoExerciseCard extends React.Component {

    /**
     * Declare refs and bind handlers
     *
     * @param {object} props
     */
    constructor(props) {
        super(props);

        this.afterPlay = this.afterPlay.bind(this);
        this.handleGetInput = this.handleGetInput.bind(this);
        this.handleError = this.handleError.bind(this);

        this.mediaRecorder = null;
        this.mimicButton = React.createRef();
        this.player = React.createRef();
    }

    /** On mount, find an audio input device and register it */
    componentDidMount() {
        navigator.mediaDevices.getUserMedia({"audio": true}).then(
            (stream) => this.handleGetInput(stream),
            (error) => this.handleGetMediaError(error)
        );
    }

    /** On update, re-establish focus on the mimic button */
    componentDidUpdate() {
        this.mimicButton.current.focus();
    }

    /** When we have recorded data available, create a URL for that and set
     * the URL in application state
     *
     * @param {object} event
     */
    onDataAvailable(event) {
        const userAudioUrl = window.URL.createObjectURL(
            event.data,
            {"type": "audio/ogg"}
        );
        this.props.doFunction.setUserAudioUrl(userAudioUrl);
    }

    /**
     * Once we've found the audio input device, create a MediaRecorder to
     * record from that device
     *
     * @param {object} stream
     */
    handleGetInput(stream) {
        window.stream = stream;
        this.mediaRecorder = new window.MediaRecorder(
            stream, config.audio.options
        );
        this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this);
    }

    /**
     * Handle errors in getting media, including no device found
     *
     * @param {object} error
     */
    handleGetMediaError(error) {
        if (error.code === 8) {
            this.props.doFunction.setStatus({
                "statusText": "Unable to find a recording device!",
                "status": "warning"
            });
            return;
        }
        this.props.doFunction.setStatus({
            "statusText": `getUserMedia(): ${error.message}`,
            "status": "error"
        });
    }

    /**
     * Convert a string in the default Moment format into seconds
     *
     * @param {string} timeString
     *
     * @return {number} seconds
     */
    timeAsSeconds(timeString) {
        return moment.duration(timeString).asSeconds();
    }

    /** A title element with the name of the prop
     *
     * @param {object} prop
     *
     * @return {object}
     */
    title(prop) {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            prop.name
        );
    }

    /**
     * A text span with the name of the item user, if any
     *
     * @return {object}
     */
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

    /**
     * A subtitle with the mediaItem name and the time range
     *
     * @return {object}
     */
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

    /**
     * A description row with the language and creator
     *
     * @return {object}
     */
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

    setStartTime() {
        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);

        if (startSeconds < 0) {
            return;
        }

        if (startSeconds > this.player.current.duration) {
            const msg = `Your startTime of ${this.props.exercise.startTime}
            seconds is greater than the total duration
            (${this.player.current.duration} seconds) of this media clip.`;
            this.props.doFunction.setStatus({
                "statusText": msg,
                "status": "error"
            });
            return;
        }
        this.player.current.currentTime = startSeconds;
        if (this.player.current.currentTime !== startSeconds) {
            const msg = `Unable to set start time.  You may need to use a
            different browser or host your media on a server that supports <a
            target="_blank"
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests"
            >byte-range requests</a>.`;
            this.props.doFunction.setStatus({
                "statusText": msg,
                "status": "error"
            });
        }
    }

    loadedMetadata() {
        if (this.props.state.status !== "playMimic") {
            this.setStartTime();
            this.props.doFunction.onMediaLoaded();
        }

        if (playActivities.includes(this.props.state.status)) {
            this.player.current.play()
                .catch(this.handleError, this.props.state.status);
        }

    }

    afterPlay() {
        if (this.props.state.clickedAction === "mimic"
            && this.props.state.status === "playModelFirst") {
            this.mediaRecorder.start();
            this.props.doFunction.setStatus({
                "status": "recording",
                "statusText": "Now recording"
            });
            return;
        }

        if (this.props.state.status === "playModelSecond") {
            if (this.props.state.userAudioUrl.length < 11) {
                this.props.doFunction.setStatus({
                    "status": "warning",
                    "statusText": "No recorded audio found",
                });
                this.setStartTime();
            } else {
                this.props.doFunction.playMimic();
            }
            return;
        }

        if (this.props.state.status === "playMimic") {
            this.props.doFunction.afterMimic(this.exerciseCount());
            return;
        }

        this.props.doFunction.setStatus({"status": "ready", "statusText": ""});
    }

    timeUpdateHandler(event) {
        if (this.props.state.status === "playModelOnly"
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
        this.afterPlay();
    }

    playHandler() {
        if (this.props.state.status !== "ready") {
            return;
        }

        if (this.props.state.nowPlaying === this.props.mediaItem.mediaUrl) {
            this.setStartTime();
            this.props.doFunction.playModel("Only");
            return;
        }

        this.props.doFunction.playMimic();
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
        this.props.doFunction.toggleOnlyExercise(event.target.checked);
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
        this.props.doFunction.queueNav[direction](this.props.rank);
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
        if (!Object.prototype.hasOwnProperty.call(
                this.props.queueInfo,
                direction
            )
        ) {
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
        if (this.props.state.selected.itemType !== "lessons") {
            return null;
        }

        const colorClass = this.props.doButton[direction].color;
        const disabled = this.navDisabled(direction);
        return React.createElement(
            "button",
            {
                "type": "button",
                "onClick": () => this.queueNav(direction),
                "className": "btn col btn-" + colorClass,
                "disabled": disabled
            },
            this.navButtonElements(direction)
        );
    }

    exerciseCount() {
        if (
            Object.prototype.hasOwnProperty.call(
                this.props.state.mimicCount,
                this.props.exercise.id
                )
            ) {
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
        this.props.doFunction.setStatus({
            "statusText": action + ": " + error.message,
            "status": "error"
        });
    }

    mimicClick() {
        if (this.props.state.status === "recording") {
            this.mediaRecorder.stop();

            this.props.doFunction.playModel("Second");
            this.setStartTime();
            return;
        }

        if (!playableActivities.includes(this.props.state.status)) {
            return;
        }

        this.setStartTime();
        this.props.doFunction.playModel("First");
    }

    makeMimicButton() {
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
        const className = "btn col-3 btn-" + colorClass;
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": className,
                "disabled": mimicDisabled,
                "onClick": this.mimicClick.bind(this),
                "ref": this.mimicButton
            },
            "Mimic ",
            this.mimicCountSpan()
        );
    }

    exitClick() {
        window.stream.getTracks().forEach(
            (track) => track.stop()
        );

        this.props.doFunction.readMode(this.props.state.selected.itemType);
    }

    exitButton() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn col-2 btn-info",
                "onClick": this.exitClick.bind(this)
            },
            commonElements.iconSpan("oi-circle-x")
        );
    }

    statusRow() {
        return React.createElement(
            "div",
            {"className": "text-" + statusColor[this.props.state.status]},
            this.props.state.statusText
        );
    }

    controls() {
        if (this.player.current) {
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
                "className": "btn-group w-100"
            },
            this.navButton("previous"),
            this.makeMimicButton(),
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

DoExerciseCard.propTypes = {
    "doButton": PropTypes.array.isRequired,
    "doFunction": PropTypes.object.isRequired,
    "exercise": PropTypes.object.isRequired,
    "itemUser": PropTypes.object.isRequired,
    "languages": PropTypes.array.isRequired,
    "lesson": PropTypes.object.isRequired,
    "maxRank": PropTypes.number.isRequired,
    "mediaItem": PropTypes.object.isRequired,
    "queueInfo": PropTypes.object.isRequired,
    "queueNav": PropTypes.object.isRequired,
    "rank": PropTypes.number.isRequired,
    "state": PropTypes.object.isRequired
};
