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
        var mediaCreator = "";
        if (this.props.mediaItem) {
            mediaCreator = this.props.mediaItem.creator;
        }

        return React.createElement(
            "div",
            {},
            mediaCreator,
            " – ",
            this.props.exercise.description
        );
    }

    /** Set the start time on the media player, handling potential errors */
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

    /** Handle metadata load; replay mimic or set the ready state in the Lab */
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

    /**
     * Handle end of playback, depending on what we just played:
     *
     * * playModelFirst - start recording
     * * playModelSecond - play back the recording
     * * playMimic - increment exercises
     */
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

    /**
     * At intervals, check to see whether we've reached the endTime.  If so,
     * and playModelOnly is checked, stop playback and call afterPlay()
     *
     * @param {object} event
     */
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

    /**
     * If the user is playing the model, set the proper functions in state
     */
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

    /**
     * Create our player element with the proper handlers
     *
     * @return {object}
     */
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

    /**
     * Handle clicks on the onlyExercise checkbox
     *
     * @param {object} event
     */
    onlyCheck(event) {
        this.props.doFunction.toggleOnlyExercise(event.target.checked);
    }

    /**
     * A div containing the player and the onlyExercise checkbox
     *
     * @return {object}
     */
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

    /**
     * Determine the appropriate function for the direction chosen, and pass
     * the current rank into it
     *
     * @param {string} direction - the direction (forward or back) of the button
     */
    queueNav(direction) {
        this.props.doFunction.queueNav[direction](this.props.rank);
    }

    /**
     * If we're at the beginning of the queue, disable the back button.  If
     * we're at the end, disable the forward button.  If we're playing or
     * recording, or we can't get the rank, disable both buttons.
     *
     * Returns a string for use in the React component props.
     *
     * @param {string) direction - the direction (forward or back) of the button
     *
     * @return {string}
     */
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

    /**
     * If we have the queueInfo prop we can include the names of the previous
     * and next exercises on the buttons, with appropriate spaces.
     *
     * @param {string} direction - the direction (forward or back) of the button
     *
     * @return {object}
     */
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

    /**
     * Queue navigation buttons (forward and back), with appropriate icons and
     * text, disabled as need be.
     *
     * @param {string} direction - the direction (forward or back) of the button
     *
     * @return {object}
     */
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

    /**
     * A count of how many times the exercise has been performed this session,
     * retrieved from props.
     *
     * @return {number}
     */
    exerciseCount() {
        if (Object.prototype.hasOwnProperty.call(
                this.props.state.mimicCount,
                this.props.exercise.id
                )
            ) {
            return this.props.state.mimicCount[this.props.exercise.id];
        }

        return 0;
    }

    /**
     * A badge containing the exercise performance count for this session.
     *
     * @return {object}
     */
    mimicCountSpan() {
        return React.createElement(
            "span",
            {"className": "badge badge-light"},
            this.exerciseCount()
        );
    }

    /**
     * Handle errors with playback by displaying them in the statusText area.
     *
     * @param {object} error - the error returned by the player
     * @param {string} action - the action being attempted
     */
    handleError(error, action="unknown") {
        console.error(error);
        this.props.doFunction.setStatus({
            "statusText": action + ": " + error.message,
            "status": "error"
        });
    }

    /**
     * Handle clicks on the "Mimic" button:
     *
     * * If we're recording, stop recording.
     * * If we're not in a state where we could start playing, do nothing
     * * Otherwise, initiate the mimic sequence with PlayModelFirst
     */
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

    /**
     * Determine the appropriate Bootstrap color class for the Mimic button:
     *
     * * "Danger" if we're recording
     * * "Success" if we're playing back
     * * "Info" otherwise
     */
     mimicButtonColor() {
        if (this.props.state.clickedAction !== "mimic") {
            return "info";
        }

        if (this.props.state.status === "recording") {
            return "danger";
        }

        if (playActivities.includes(this.props.state.status)) {
            return "success";
        }

        return "info";
    }

    /**
     * Create the Mimic button element with the appropriate color.  Disable if
     * we're in the middle of playing something.
     *
     * @return {object}
     */
    makeMimicButton() {
        const mimicDisabled = playActivities.includes(
            this.props.state.status
        );

        const className = "btn col-3 btn-" + this.mimicButtonColor();
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

    /**
     * If the user clicks the exit button, stop any recording tracks to release
     * the microphone to other apps, and go back to read mode.
     */
    exitClick() {
        if (!window.stream) {
            return;
        }
        window.stream.getTracks().forEach(
            (track) => track.stop()
        );

        this.props.doFunction.readMode(this.props.state.selected.itemType);
    }

    /**
     * The button to exit "do" mode.
     *
     * @return {object}
     */
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

    /**
     * A div with the statusText from props
     *
     * @return {object}
     */
    statusRow() {
        return React.createElement(
            "div",
            {"className": "text-" + statusColor[this.props.state.status]},
            this.props.state.statusText
        );
    }

    /**
     * Buttons to control the exercise: navigation, mimic, exit.  This is also a
     * place in the render function to start playing if the media is ready.
     *
     * @return {object}
     */
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

    /**
     * A card header, with title and subtitle based on the lesson (if any)
     *
     * @return {object}
     */
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

    /**
     * The body of the doExerciseCard: exercise title, subtitle, description,
     * player, status and controls
     *
     * @return {object}
     */
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

    /**
     * The render function: header and body
     *
     * @return {object}
     */
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
    "lesson": PropTypes.object.isRequired,
    "maxRank": PropTypes.number.isRequired,
    "mediaItem": PropTypes.object.isRequired,
    "queueInfo": PropTypes.object.isRequired,
    "queueNav": PropTypes.object.isRequired,
    "rank": PropTypes.number.isRequired,
    "state": PropTypes.object.isRequired
};
