/**
 * Card for performing exercises in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

import commonElements from "./commonElements.js";
import config from "./config.js";
import util from "./util.js";

/** Card for performing exercises in the LanguageLab client */
export default class DoExerciseCard {

    /**
     * Declare refs and bind handlers
     */
    constructor() {
        this.mediaRecorder = {};
        this.player = {};

        this.state = {
            "nowPlaying": "",
            "status": "loading",
            "userAudioUrl": ""
        };
    }

    /** When we have recorded data available, create a URL for that and set
     * the URL in application state
     *
     * @param {object} event
     */
    onDataAvailable(event) {
        console.log("dataavailable", event);
        this.state.userAudioUrl = window.URL.createObjectURL(
            event.data,
            {"type": "audio/ogg"}
        );
    }

    /**
     * Once we've found the audio input device, create a MediaRecorder to
     * record from that device
     *
     * @param {object} stream
     */
    handleGetInput(stream) {
        console.log("handleGetInput", stream);
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

    /** On mount, find an audio input device and register it */
    getMedia() {
        navigator.mediaDevices.getUserMedia({"audio": true}).then(
            (stream) => this.handleGetInput(stream),
            (error) => this.handleGetMediaError(error)
        );
    }

    /** Set the start time on the media player, handling potential errors */
    setStartTime() {
        console.log("setStartTime", this);
        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);

        if (startSeconds < 0) {
            return;
        }

        if (startSeconds > this.player.duration) {
            const msg = `Your startTime of ${this.props.exercise.startTime}
            seconds is greater than the total duration
            (${this.player.duration} seconds) of this media clip.`;
            this.props.doFunction.setStatus({
                "statusText": msg,
                "status": "error"
            });
            return;
        }

        this.player.currentTime = startSeconds;

        if (this.player.currentTime !== startSeconds) {
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
    handleLoadedMetadata() {
        console.log("Time to set up handleLoadedMetadata()");
    }

    /** Set the state to play the mimic recording */
    playMimic() {
        console.log("Time to set up playMimic()");
    }

    /**
     * Handle end of playback, depending on what we just played:
     *
     * * playModelFirst - start recording
     * * playModelSecond - play back the recording
     * * playMimic - increment exercises
     */
    afterPlay() {
        console.log("Time to set up afterPlay()");
    }

    /**
     * At intervals, check to see whether we've reached the endTime.  If so,
     * and playModelOnly is checked, stop playback and call afterPlay()
     *
     * @param {object} event
     */
    timeUpdateHandler(event) {
        console.log("Time to set up timeUpdateHandler()");
    }

    /**
     * If the user is playing the model, set the proper functions in state
     */
    playHandler() {
        console.log("Time to set up playHandler()");
    }

    /**
     * Handle clicks on the onlyExercise checkbox
     *
     * @param {object} event
     */
    handleOnlyCheck(event) {
        console.log("Time to set up handleOnlyCheck()!");
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
        const element = document.createElement("h5");
        element.classList.add("card-title");
        element.innerText = prop.name;

        return element;
    }

    /**
     * A text span with the name of the item user, if any
     *
     * @return {object}
     */
    bySpan() {
        if (!this.props.itemUser) {
            return "";
        }

        const element = document.createElement("span");
        element.classList.add("text-dark");
        element.innerText = " by " + this.props.itemUser.username;

        return element;
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

        let mediaName = "";
        if (this.props.mediaItem) {
            mediaName = this.props.mediaItem.name + ", ";
        }

        const element = document.createElement("h6");
        element.classList.add("card-subtitle", "text-muted");
        element.innerText = mediaName + timeRange;

        return element;
    }

    /**
     * A description row with the language and creator
     *
     * @return {object}
     */
    descriptionRow() {
        let mediaCreator = "";
        if (this.props.mediaItem) {
            mediaCreator = this.props.mediaItem.creator;
        }

        const element = document.createElement("div");
        element.innerText = mediaCreator + " – "
            + this.props.exercise.description;

        return element;
    }

    /**
     * Create our player element with the proper handlers
     *
     * @return {object}
     */
    makePlayer() {
        console.log("makePlayer", this.state);
        console.log("props", this.props);
        const startSeconds = this.timeAsSeconds(this.props.exercise.startTime);
        const endSeconds = this.timeAsSeconds(this.props.exercise.endTime);

        const timeUpdateHandler = startSeconds < endSeconds
            ? this.timeUpdateHandler.bind(this) : null;

        const element = document.createElement("audio");
        element.id = "audio1";
        element.src = this.props.nowPlaying;
        element.controls = true;
        element.style.width = "70%";

        element.addEventListener("ended", this.afterPlay.bind(this));
        element.addEventListener(
            "loadedmetadata", this.handleLoadedMetadata.bind(this)
        );
        element.addEventListener("play", this.playHandler.bind(this));
        element.addEventListener("timeupdate", timeUpdateHandler);

        return element;
    }

    /**
     * A div containing the player and the onlyExercise checkbox
     *
     * @return {object}
     */
    playerDiv() {
        const element = document.createElement("div");
        element.classList.add("d-flex", "flex-row", "mt-3");

        this.player = this.makePlayer();

        element.append(
            this.player,
            commonElements.checkboxDiv(
                "onlyExercise",
                this.props.onlyExercise,
                "Play only this exercise",
                this.props.exercise.id,
                this.handleOnlyCheck.bind(this)
            )
        );

        return element;
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
     * Returns a string for use in the component props.
     *
     * @param {string) direction - the direction (forward or back) of the button
     *
     * @return {string}
     */
    navDisabled(direction) {
        if (config.activeStatuses.includes(this.state.status)) {
            return "disabled";
        }

        if (!this.props.rank) {
            return "disabled";
        }
        if (direction === "previous") {
            return this.props.rank <= 1 ? "disabled" : "";
        }
        if (direction === "next") {
            return this.props.rank >= this.props.maxRank
                ? "disabled" : "";
        }

        return "";
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
        if (!(direction in this.props.queueInfo)) {
            return commonElements.iconSpan(config.doButton[direction].icon);
        }

        const nameText = util.truncateString(
            this.props.queueInfo[direction].name,
            config.exerciseNameLimit
        );

        if (direction === "previous") {
            const element = document.createElement("span");
            element.append(
                commonElements.iconSpan(config.doButton[direction].icon),
                " " + nameText
            );

            return element;
        }

        const element = document.createElement("span");

        element.append(
            nameText + " ",
            commonElements.iconSpan(config.doButton[direction].icon)
        );

        return element;
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
        if (this.props.selected.itemType !== "lessons") {
            return "";
        }

        const element = document.createElement("button");

        const colorClass = config.doButton[direction].color;
        element.classList.add("btn", "col", "btn-" + colorClass);

        element.type = "button";
        element.disabled = this.navDisabled(direction);

        element.addEventListener("click", () => this.queueNav(direction));
        element.append(this.navButtonElements(direction));

        return element;
    }

    /**
     * A count of how many times the exercise has been performed this session,
     * retrieved from props.
     *
     * @return {number}
     */
    exerciseCount() {
        if (this.props.exercise.id in this.mimicCount) {
            return this.mimicCount[this.props.exercise.id];
        }

        return 0;
    }

    /**
     * A badge containing the exercise performance count for this session.
     *
     * @return {object}
     */
    mimicCountSpan() {
        const element = document.createElement("span");
        element.classList.add("badge", "badge-light");
        element.append(this.exerciseCount());

        return element;
    }

    /**
     * Determine the appropriate Bootstrap color class for the Mimic button:
     *
     * * "Danger" if we're recording
     * * "Success" if we're playing back
     * * "Info" otherwise
     */
     mimicButtonColor() {
        if (this.state.clickedAction !== "mimic") {
            return "info";
        }

        if (this.state.status === "recording") {
            return "danger";
        }

        if (config.playStatuses.includes(this.state.status)) {
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
        const element = document.createElement("button");
        element.classList.add("btn", "col-3", "btn-" + this.mimicButtonColor());
        element.type = "button";

        element.disabled = config.playStatuses.includes(this.state.status);
        element.addEventListener("click", this.mimicClick.bind(this));

        element.append("Mimic ", this.mimicCountSpan());

        return element;
    }

    /**
     * Handle clicks on the "Mimic" button:
     *
     * * If we're recording, stop recording.
     * * If we're not in a state where we could start playing, do nothing
     * * Otherwise, initiate the mimic sequence with PlayModelFirst
     */
    mimicClick() {
        console.log("time to set up mimicClick()!");
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

        this.props.doFunction.updateMimicCount(this.mimicCount);
        this.props.doFunction.readMode(this.props.selected.itemType);
    }

    /**
     * The button to exit "do" mode.
     *
     * @return {object}
     */
    exitButton() {
        const element = document.createElement("button");
        element.classList.add("btn", "col-2", "btn-info");
        element.type = "button";
        element.addEventListener("click", this.exitClick.bind(this));

        element.append(commonElements.iconSpan("oi-circle-x"));

        return element;
    }

    /**
     * A div with the statusText from props
     *
     * @return {object}
     */
    statusRow() {
        const element = document.createElement("div");
        element.classList.add("text-" + config.statusColor[this.state.status]);
        element.innerText = this.props.statusText;

        return element;
    }

    /**
     * Buttons to control the exercise: navigation, mimic, exit.  This is also a
     * place in the render function to start playing if the media is ready.
     *
     * @return {object}
     */
    controls() {
        const element = document.createElement("div");
        element.classList.add("btn-group", "w-100");

        element.append(
            this.navButton("previous"),
            this.makeMimicButton(),
            this.exitButton(),
            this.navButton("next")
        );

        return element;
    }

    /**
     * A card header, with title and subtitle based on the lesson (if any)
     *
     * @return {object}
     */
    cardHeader() {
        if (!this.props.lesson) {
            return "";
        }

        const element = document.createElement("div");
        element.classList.add("card-header");

        element.append(
            this.title(this.props.lesson),
            commonElements.lessonSubtitle(this.props.lesson)
        );

        return element;
    }

    /**
     * The body of the doExerciseCard: exercise title, subtitle, description,
     * player, status and controls
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("div");
        element.classList.add("card-body");

        this.statusRowObject = this.statusRow();

        element.append(
            this.title(this.props.exercise),
            this.itemSubtitle(),
            this.descriptionRow(),
            this.playerDiv(),
            this.statusRowObject,
            this.controls()
        );

        return element;
    }

    /**
     * The render function: header and body.  Run .getMedia() while we're at it.
     *
     * @return {object}
     */
    render(props) {
        this.props = props;
        console.log("DoExerciseCard", this.props);

        this.state.nowPlaying = this.props.nowPlaying;
        this.state.status = this.props.status;

        this.mimicCount = this.props.mimicCount;

        this.getMedia();

        const element = document.createElement("div");
        element.classList.add("card", "bg-light", "mb-3");

        element.append(this.cardHeader(), this.cardBody());
        return element;
    }
};