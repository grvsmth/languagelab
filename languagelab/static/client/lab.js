/**
 * Main page for Language Lab, with state handling
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global moment, React

*/
import CardList from "./cardList.js";
import InfoArea from "./infoArea.js";
import LoadingModal from "./loadingModal.js";
import LoginForm from "./loginForm.js";
import Navbar from "./navbar.js";

import controls from "./controls.js";
import LanguageLabClient from "./apiClient.js";
import storageClient from "./storageClient.js";
import util from "./util.js";

import config from "./config.js";
import environment from "./environment.js";

/** The main lab class. @extends React.Component */
export default class Lab extends React.Component {

    /** Bind methods, instantiate API client and set sefault state */
    constructor(props) {
        super(props);

        this.checkClick = this.checkClick.bind(this);
        this.handleFetchError = this.handleFetchError.bind(this);

        this.queueOperation = {
            "add": this.addToQueue.bind(this),
            "remove": this.removeFromQueue.bind(this),
            "up": this.up.bind(this),
            "down": this.down.bind(this)
        };

        this.queueNav = {
            "previous": this.previous.bind(this),
            "exit": this.readMode.bind(this),
            "next": this.next.bind(this)
        };

        const storageData = storageClient.launchData();

        this.apiClient = new LanguageLabClient();
        this.apiClient.setBaseUrl(environment.api.baseUrl);
        this.apiClient.setHandleToken(this.handleToken.bind(this));
        if (Object.prototype.hasOwnProperty.call(
            config.api, "refreshThreshold")
        ) {
            this.apiClient.setRefreshThreshold(config.api.refreshThreshold)
        }
        if (storageData.token) {
            this.apiClient.setToken(
                storageData.token, storageData.tokenTime, storageData.tokenLife
            );
        }

        this.state = {
            "activity": "login",
            "alerts": [],
            "clickedAction": "",
            "controls": controls,
            "currentUser": storageData.currentUser,
            "exercises": [],
            "languages": [],
            "lastUpdated": "",
            "lessons": [],
            "loading": {
                "exercises": true,
                "languages": true,
                "lessons": true,
                "media": true
            },
            "onlyExercise": true,
            "media": [],
            "mimicCount": {},
            "nowPlaying": "",
            "selected": {
                "exercises": null,
                "languages": null,
                "lessons": null,
                "media": null,
                "itemType": "lessons"
            },
            "status": "ready",
            "statusText": "Ready",
            "users": [],
            "userAudioUrl": ""
        };
    }

    /**
     * If we haven't fetched anything yet, fetch it all
     */
    componentDidMount() {
        if (!this.state.lastUpdated && this.apiClient.hasToken()) {
            this.fetchAll();
        }
    }

    /**
     * Set the status code and display text for the DoExerciseCard
     *
     * @param {object} input - An object containing the new status and text
     */
    setStatus(input) {
        this.setState({
            "status": input.status,
            "statusText": input.statusText
        })
    }

    /**
     * Set the userAudioUrl in state
     *
     * @param {string} url - the target userAudioUrl
     *
     */
    setUserAudioUrl(url) {
        this.setState({"userAudioUrl": url});
    }

    /**
     * Update the state after a successful mimic round.  Return the status to
     * "ready," remove the clickedAction and increment the mimicCount
     *
     * @param {number} prevMimicCount - The previous mimicCount for this exercise
     */
    afterMimic(prevMimicCount) {
        this.setState(prevState => ({
            "status": "ready",
            "statusText": "Ready",
            "clickedAction": null,
            "mimicCount": {
                ...prevState.mimicCount,
                [prevState.selected.exercises]: prevMimicCount + 1
            }
        }));
    }

    /**
     * Pull the list of things to load from the config, and fetch them all
     *
     */
    fetchAll() {
        const loading = {};

        const thingsToLoad = config.api.models
            .filter(model => !model.local)
            .map(model => model.endpoint)
            .concat(["currentUser"]);

        thingsToLoad.forEach((endpoint) => {
            loading[endpoint] = true;
            this.fetchData(endpoint);
        });
        this.setState({
            "activity": "read",
            "loading": loading
        });
    }

    /**
     * Get a timestamp, compose an API url from the datatype and config, and
     * call fetchData in the API client.  Once the data is received, save it to
     * state.
     *
     * @param {string} dataType - the type of data to fetch from the API
     */
    fetchData(dataType) {
        const loadTime = new moment();
        const apiUrl = [
            environment.api.baseUrl, dataType
        ].join("/");

        this.apiClient.fetchData(apiUrl).then((res) => {
            this.setState(prevState => ({
                [dataType]: res,
                "lastUpdated": loadTime.format(),
                "loading": {
                    ...prevState.loading,
                    [dataType]: false
                }
            }));
        }, this.handleFetchError);
    }

    /**
     * Add an alert to the state
     *
     * @param {string} title - the title to display in bold
     * @param {string} message - the message to display
     * @param {string} status - the Bootstrap class to determine the color
     */
    addAlert(title, message, status="danger") {
        const alert = {
            "id": util.maxId(this.state.alerts) + 1,
            "title": title,
            "status": status,
            "message": message
        };
        this.updateStateItem(alert, "alerts");
    }

    /**
     * Check for alerts with a given title to avoid duplication
     *
     * @param {string} title - the title to search for in the alert array
     */
    findAlert(title) {
        return this.state.alerts.find((alert) => alert.title === title);
    }

    /**
     * Handle 401 Unauthorized errors.  Remove loading status from state and
     * send an alert if we haven't already
     *
     */
    handleUnauthorized() {
        const titleText = "Unauthorized on server";
        const errorMessage = "Please try logging in again";
        this.setState({
            "activity": "login",
            "loading": {}
        });
        if (!this.findAlert(titleText) && this.state.activity != "login") {
            this.addAlert(titleText, errorMessage);
        }
    }

    /**
     * Handle fetch errors.  If the token is expired, then make the user log
     * in again.
     *
     * TODO There's some confusion about the format of various errors that get
     * passed to this function.  Until we have it sorted out, let's keep the log
     * statements.
     *
     * @param {object} err - The error object
     */
    handleFetchError(err) {
        if (Object.hasOwnProperty.call(err, "status") && err.status === 401) {
            this.handleUnauthorized();
            return;
        }

        if (Object.hasOwnProperty.call(err, "statusText")) {
            console.log("err.statusText", err.statusText);
            this.addAlert("Fetch error", err.statusText);
            return;
        }

        if (Object.prototype.hasOwnProperty.call(err, "message")) {
            if (err.message === "Expired token!") {
                this.handleUnauthorized(err.message);
                return;
            }

            console.log("err.message", err.message);
            this.addAlert("Fetch error", err.message);
            return;
        }

        console.log("err", err);
        this.addAlert("Fetch error", err);
    }


    /**
     * Update specific state items under three circumstances:
     *
     * * for adding alerts
     * * when received from the API after a checkbox click
     * * when received from the API after saveItem()
     *
     * @param {object} res - the item to be added to the array
     * @param {string} itemType - the key where the item is stored in state
     * @param {string} activity - set the activity to "read" to exit edit mode
     * @param {boolean} resetSelected - reset all the selections
     *
     */
    updateStateItem(res, itemType, activity=null, resetSelected=false) {
        const items = [...this.state[itemType]];
        const index = items.findIndex((item) => item.id === res.id);

        if (index < 0) {
            items.push(res);
        } else {
            items[index] = res;
        }

        const targetState = {[itemType]: items};
        if (activity) {
            targetState.activity = activity;
        }
        if (resetSelected) {
            targetState.selected = {
                ...this.state.selected,
                "exercises": null,
                "languages": null,
                "lessons": null,
                "media": null
            };
        }

        this.setState(targetState);
    }

    /**
     * If the token is well-formed, save it to state, along with the received
     * time and the expected token life
     *
     * TODO We probably don't need the extra layer of "response"
     *
     * @param {object} res - the server response including the token
     */
    handleToken(res) {
        const loadTime = new moment();
        if (!Object.prototype.hasOwnProperty.call(res, "token")) {
            throw new Error("No token in response!");
        }

        storageClient.setToken(
            res.token, loadTime.format(), res.expiresIn
        );

        this.apiClient.setToken(
            res.token, loadTime.format(), res.expiresIn
        );
        this.fetchAll();
    }

    /**
     * If we have an error getting the token, handle that.
     *
     * @param {object} err - the error returned by the token method
     */
    handleTokenError(err) {
        console.error(err);

        let alertText = "Please see the Javascript console";

        if (Object.hasOwnProperty.call(err, "statusText")) {
            alertText = err.statusText;
        }

        if (err.status === 400) {
            alertText = "Invalid username or password."
        }

        this.addAlert("Token error", alertText);
    }

    /**
     * If we have an error logging in, handle that.
     *
     * @param {object} err - the error returned by the login method
     */
    handleLoginError(err) {
        var alertText = "There was an error logging you in.";

        if (Object.prototype.hasOwnProperty.call(err.statusText)) {
            alertText = err.statusText;
        }

        if (err.status === 400) {
            alertText = "Invalid username or password."
        }

        this.addAlert("Unable to log in", alertText);
    }

    /**
     * Retrieve the username and password from the form, and then pass it to
     * the API login function
     *
     * @param {object} event - the click event passed by the browser
     */
    loginClick(event) {
        event.preventDefault();
        const options = {
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value
        };

        this.apiClient.login(options).then(
            this.handleToken.bind(this),
            this.handleLoginError.bind(this)
        );
    }

    /**
     * Clear the user ID from state and set the activity to login
     *
     */
    logout() {
        if (this.state.currentUser) {
            storageClient.clearAll();
            this.setState({
                "activity": "login",
                "currentUser": null
            });
            return;
        }
    }

    /**
     * Remove an item from the queue
     *
     * @param {number} queueItemId - the index of the queue item to remove
     */
    removeFromQueue(queueItemId) {
        this.apiClient.delete(
            environment.api.baseUrl, "queueItems", queueItemId
        ).then(() => {this.fetchData("lessons");}, this.handleFetchError
        );
    }

    /**
     * Add an exercise to the queue
     *
     * @param {number} exerciseId - the index of the exercise to add
     * @param {number} lessonId - the index of the lesson to add the exercise to
     */
    addToQueue(exerciseId, lessonId) {
        const queueItem = {
            "exercise": exerciseId,
            "lesson": lessonId
        };
        this.apiClient.post(environment.api.baseUrl, "queueItems", queueItem)
            .then(() => {
                this.fetchData("lessons");
                this.fetchData("exercises");
            }, this.handleFetchError
        );
    }

    /**
     * Handle various queue operations.
     *
     * @param {string} operationName - queue operation (add, remove, up, down)
     * @param {number} id - the exercise to add, remove or move
     * @param {number} lessonId - the lesson with the queue
     */
    queueClick(operationName, id, lessonId=null) {
        this.queueOperation[operationName](id, lessonId);
    }

    /**
     * Handle a click on a checkbox: update the API and save state
     *
     * @param {string} itemType - the type of item clicked on (lesson, etc.)
     * @param {number} itemId - the item to modify
     * @param {string} itemKey - the variable to modify on that item
     * @param {boolean} itemChecked - the checkbox status submitted by the user
     */
    checkClick(itemType, itemId, itemKey, itemChecked) {
        event.preventDefault();
        const payload = {[itemKey]: itemChecked};
        this.apiClient.patch(environment.api.baseUrl, itemType, payload, itemId)
            .then((res) => {
            this.updateStateItem(res, itemType);
        }, this.handleFetchError
        );
    }

    /**
     * Select an item.  Used when playing media in mediaCard.js, and when
     * starting the edit activity
     *
     * @param {number} itemId - the item selected
     * @param {string} activity - an optional activity to set in the state
     */
    selectItem(itemId, activity=null) {
        const targetState = {
            "selected": {
                ...this.state.selected,
                [this.state.selected.itemType]: itemId
            }
        };
        if (activity) {
            targetState.activity = activity;
        }
        this.setState(targetState);
    }

    /**
     * Return the ID of the first exercise in a lesson queue
     *
     * @param {number} lessonId - the ID of the lesson
     */
    firstExerciseId(lessonId) {
        const lesson = util.findItem(this.state.lessons, lessonId);

        if (!lesson.queueItems) {
            return null;
        }

        return lesson.queueItems[0].exercise;
    }

    /**
     * If there is no active exercise, start the first exercise in the lesson.
     * If there is an active exercise, return to read mode
     *
     * @param {number} lessonId - the ID of the lesson
     */
    toggleLesson(lessonId) {
        if (this.state.activity === "do"
            && this.state.selected.lessons == lessonId) {
            this.readMode();
            return;
        }
        this.startExercise(this.firstExerciseId(lessonId), lessonId);
    }

    /**
     * Set the state to indicate whether to restrict media playback to the start
     * and end times
     */
    toggleOnlyExercise() {
        this.setState(prevState => ({"onlyExercise": !prevState.onlyExercise}));
    }

    /**
     * Handle the mediaLoaded event by setting mediaStatus to ready in state
     */
    onMediaLoaded() {
        this.setState({"mediaStatus": "ready"});
    }

    /**
     * Start a new exercise in a given lesson
     *
     * @param {number} exerciseId - the ID of the selected exercise
     * @param {number} lessonId - the ID of the lesson
     */
    startExercise(exerciseId, lessonId=null) {
        const exercise = util.findItem(this.state.exercises, exerciseId);
        const mediaItem = util.findItem(this.state.media, exercise.media);

        if (!Object.prototype.hasOwnProperty.call(mediaItem, "mediaUrl")) {
            this.addAlert("Media error", "Unable to find media for exercise!");
            return;
        }

        const targetState = {
            "activity": "do",
            "mediaStatus": "loading",
            "nowPlaying": mediaItem.mediaUrl,
            "selected": {
                ...this.state.selected,
                "exercises": exerciseId
            }
        };

        if (lessonId) {
            targetState.selected.lessons = lessonId;
        }
        this.setState(targetState);
    }

    /**
     * Set an activity, and optionally select an exercise and lesson
     *
     * @param {string} activity - the selected activity
     * @param {number} exerciseId - the selected exercise (optional)
     * @param {number} lessonId - the selected lesson (optional)
     */
    setActivity(activity, exerciseId=null, lessonId=null) {
        this.setState((prevState) => ({
            "activity": activity,
            "selected": {
                ...prevState.selected,
                "exercises": exerciseId,
                "lessons": lessonId
            }
        }));
    }

    /**
     * Call the delete method in the API client to delete an item
     *
     * @param {string} itemType - the type of item to delete
     * @param {number} itemId - the ID of the item to delete
     */
    deleteClick(itemType, itemId) {
        this.apiClient.delete(environment.api.baseUrl, itemType, itemId)
            .then(this.fetchAll, this.handleFetchError);
    }

    /**
     * Submit a new item via POST, or an updated item via PATCH, to the API
     * client
     *
     * @param {object} item - the item to send to the API
     * @param {string} itemType - the type of the item to send
     * @param {number} itemId - if we are updating an item via PATCH, the ID
     */
    saveItem(item, itemType, itemId) {
        if (itemId) {
            this.apiClient.patch(environment.api.baseUrl, itemType, item, itemId)
                .then((res) => {
                    this.updateStateItem(res.response, itemType, "read", true);
                }, this.handleFetchError
            );
        } else {
            if (itemType === "lessons") {
                item.level = parseInt(item.level);
            }
            console.log(`saveItem(${itemType})`, item);
            this.apiClient.post(environment.api.baseUrl, itemType, item).then(
                (res) => {
                    this.updateStateItem(res.response, itemType, "read", true);
                }, this.handleFetchError
            );
        }
    }

    /**
     * Move a queue item up in a queue
     *
     * @param {number} itemId - The ID of the queue item to move up
     */
    up(itemId) {
        this.apiClient.patch(
            environment.api.baseUrl, "queueItems", {"item": itemId}, "up"
        ).then(
            () => {this.fetchData("lessons");}, this.handleFetchError
        );
    }

    /**
     * Move a queue item down in a queue
     *
     * @param {number} itemId - The ID of the queue item to move down
     */
    down(itemId) {
        this.apiClient.patch(
            environment.api.baseUrl, "queueItems", {"item": itemId}, "down"
        ).then(
            () => {this.fetchData("lessons");}, this.handleFetchError
        );
    }

    /**
     * Find the highest rank in the selected lesson
     *
     * @return {number}
     */
    maxRank() {
        if (!this.state.selected.lessons) {
            return 0;
        }

        const lesson = util.findItem(
            this.state.lessons, this.state.selected.lessons
        );

        if (lesson.queueItems.length < 1) {
            return 0;
        }

        const last = lesson.queueItems[lesson.queueItems.length - 1];
        return last.rank;
    }

    /**
     * Given a rank, find the queue item in the selected lesson with that rank,
     * the exercise in that queue item, the media item in that exercise, and the
     * URL for that media item.
     *
     * Set the exercise as selected in state, and set the media URL to
     * nowPlaying
     *
     * @param {number} rank - the rank to select
     */
    selectByRank(rank) {
        const lesson = util.findItem(
            this.state.lessons, this.state.selected.lessons
        );

        const queueItem = lesson.queueItems.find(
            (queueItem) => queueItem.rank === rank
        );

        const exercise = util.findItem(
            this.state.exercises,
            queueItem.exercise
        );

        const mediaItem = util.findItem(this.state.media, exercise.media);

        if (!Object.prototype.hasOwnProperty.call(mediaItem, "mediaUrl")) {
            this.addAlert("Media error", "Unable to find media for exercise!");
            return;
        }

        this.setState((prevState) => ({
            "activity": "loadExercise",
            "nowPlaying": mediaItem.mediaUrl,
            "selected": {
                ...prevState.selected,
                "exercises": queueItem.exercise
            }
        }));
    }

    /**
     * If there is a rank below the current rank, select that
     *
     * @param {number} rank - the current rank
     */
    previous(rank) {
        if (rank <= 1) {
            return;
        }
        this.selectByRank(rank - 1);
    }

    /**
     * If there is a rank in the queue above the current rank, select that
     *
     * @param {number} rank - the current rank
     */
    next(rank) {
        if (rank >= this.maxRank()) {
            return;
        }
        this.selectByRank(rank + 1);
    }

    /**
     * On receiving export data from the API, open that data in a new window
     *
     * @param {object} res - the export data returned by the API client
     * @param {string} mimeType - the data format to return to the browser
     */
    handleExportData(res, mimeType) {
        const blob = new Blob([JSON.stringify(res)], {"type": mimeType});
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
    }

    /**
     * Send an export data request to the API client
     *
     * @param {object} control - an object containing the endpoint and mimeType
     */
    exportData(control) {
        const apiUrl = [
            environment.api.baseUrl, control.endpoint
        ].join("/");

        this.apiClient.fetchData(apiUrl).then((res) => {
                this.handleExportData(res, control.mimeType);
        }, this.handleFetchError.bind(this));
    }

    /** Set the state to play the mimic recording */
    playMimic() {
        this.setState({
            "nowPlaying": this.state.userAudioUrl,
            "status": "playMimic",
            "statusText": "Now playing recorded audio"
        });
    }

    /**
     * Given the increment stage of the repetition, play the mediaItem for the
     * exercise
     *
     * @param {string} increment - "first" or "second" increment of playback
     */
    playModel(increment) {
        const exercise = util.findItem(
            this.state.exercises,
            this.state.selected.exercises
        );

        const mediaItem = util.findItem(this.state.media, exercise.media);
        if (!Object.prototype.hasOwnProperty.call(mediaItem, "mediaUrl")) {
            this.addAlert("Media error", "Unable to find media for exercise!");
            return;
        }

        const targetState = {
            "clickedAction": "mimic",
            "status": "playModel" + increment,
            "statusText": "Now playing " + mediaItem.name
        };

        if (this.state.nowPlaying !== mediaItem.mediaUrl) {
            targetState.mediaStatus = "loading";
            targetState.nowPlaying = mediaItem.mediaUrl;
        }

        if (increment === "Only") {
            targetState.clickedAction = "play"
        }

        this.setState(targetState);
    }

    /**
     * If the user isn't logged in, display the login form.  If we're still
     * loading the selected item, display nothing.  Otherwise, display the
     * CardList
     */
    body() {
        if (!this.state.currentUser) {
            return React.createElement(
                LoginForm,
                {
                    "loginClick": this.loginClick.bind(this)
                },
                null
            );
        }

        if (this.state.loading[this.state.selected.itemType]) {
            return null;
        }

        return React.createElement(
            CardList,
            {
                "checkClick": this.checkClick,
                "deleteClick": this.deleteClick.bind(this),
                "doButton": config.doButton,
                "doFunction": {
                    "afterMimic": this.afterMimic.bind(this),
                    "onMediaLoaded": this.onMediaLoaded.bind(this),
                    "playMimic": this.playMimic.bind(this),
                    "playModel": this.playModel.bind(this),
                    "queueNav": this.queueNav,
                    "readMode": this.readMode.bind(this),
                    "setStatus": this.setStatus.bind(this),
                    "setUserAudioUrl": this.setUserAudioUrl.bind(this),
                    "toggleOnlyExercise": this.toggleOnlyExercise.bind(this)
                },
                "exportData": this.exportData.bind(this),
                "maxRank": this.maxRank.bind(this),
                "queueClick": this.queueClick.bind(this),
                "saveItem": this.saveItem.bind(this),
                "state": this.state,
                "setActivity": this.setActivity.bind(this),
                "toggleLesson": this.toggleLesson.bind(this),
                "startExercise": this.startExercise.bind(this),
                "selectItem": this.selectItem.bind(this)
            },
            null
        );
    }

    /**
     * Set the activity to read mode, selecting an itemType to display and
     * clearing the selected exercises and lessons
     *
     * @param {string} itemType - the type of item to select
     */
    readMode(itemType="lessons") {
        this.setState({
            "activity": "read",
            "clickedAction": null,
            "nowPlaying": null,
            "selected": {
                "exercises": null,
                "itemType": itemType,
                "languages": null,
                "lessons": null,
                "media": null
            },
            "status": "ready",
            "statusText": ""
        });
    }

    /** Display the navbar */
    nav() {
        return React.createElement(
            Navbar,
            {
                "currentUser": this.state.currentUser,
                "logout": this.logout.bind(this),
                "models": config.api.models,
                "navClick": this.readMode.bind(this),
                "selectedType": this.state.selected.itemType,
                "version": config.version
            },
            null
        );
    }

    /**
     * Retrieve the list of alerts from state and remove the alert with a given
     * ID
     *
     * @param {number} id - the ID of the alert to remove
     */
    dismissAlert(id) {
        const alerts = [...this.state.alerts];
        const alertIndex = alerts.findIndex((alert) => alert.id == id);

        alerts.splice(alertIndex, 1);
        this.setState({"alerts": alerts});
    }

    /** Display the infoArea, passing the selected lesson */
    infoArea() {
        const lesson = util.findItem(
            this.state.lessons, this.state.selected.lessons
        );

        return React.createElement(
            InfoArea,
            {
                "activity": this.state.activity,
                "alerts": this.state.alerts,
                "dismissAlert": this.dismissAlert.bind(this),
                "iso639": config.iso639,
                "lesson": lesson,
                "selectedType": this.state.selected.itemType,
                "setActivity": this.setActivity.bind(this)
            },
            null
        )
    }

    /**
     * Display the loadingModal
     *
     * @return {object}
     */
    loadingModal() {
        const localTypes = config.api.models
            .filter(model => model.local)
            .map(model => model.endpoint);

        return React.createElement(
            LoadingModal,
            {
                "activity": this.state.activity,
                "itemType": this.state.selected.itemType,
                "loading": this.state.loading,
                "localTypes": localTypes
            }
        );
    }

    /** The React render function, displaying the root element */
    render() {
        return React.createElement(
            "div",
            {
                "className": "container-fluid"
            },
            this.nav(),
            this.infoArea(),
            this.body(),
            this.loadingModal()
        );
    }
}