/**
 * Main page for Language Lab, with state handling
 *
 * Angus Andrea Grieve-Smith, 2026
 *
 */

/*

    global moment

*/

import CardList from "./cardList.js";
import InfoArea from "./infoArea.js";
import LoadingModal from "./loadingModal.js";
import LoginForm from "./loginForm.js";
import Navbar from "./navbar.js";

import LanguageLabClient from "./apiClient.js";
import storageClient from "./storageClient.js";
import util from "./util.js";

const notLoading = {
    "exercises": false,
    "languages": false,
    "lessons": false,
    "media": false
};


/** The main lab class. */
export default class Lab {
    /** Bind methods, instantiate API client and set default state */
    constructor(config) {
        this.config = config;
        this.help = {};
        this.parentElement = {};
        const storageData = storageClient.launchData();
        console.log("storageData", storageData);

        this.apiClient = new LanguageLabClient();
        this.apiClient.setBaseUrl(this.config.api.baseUrl);
        this.apiClient.setHandleToken(this.handleToken.bind(this));
        if ("refreshThreshold" in this.config.api) {
            this.apiClient.setRefreshThreshold(
                this.config.api.refreshThreshold
            );
        }

        if ("accessToken" in storageData && storageData.accessToken) {
            const token = {
                "access": storageData.accessToken,
                "refresh": storageData.refreshToken
            };

            this.apiClient.setToken(token, storageData.tokenTime);
        }

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

        this.loadingState = {
            "exercises": true,
            "languages": true,
            "lessons": true,
            "media": true
        };

        this.selectedState = {
            "exercises": null,
            "languages": null,
            "lessons": null,
            "media": null,
            "itemType": "lessons"
        };

        this.data = {
            "currentUser": storageData.currentUser,
            "exercises": [],
            "languages": [],
            "lessons": [],
            "media": [],
            "users": []
        };

        this.mimicCount = {};

        this.state = {
            "activity": "read",
            "alerts": [],
            "clickedAction": "",
            "exercises": [],
            "languages": [],
            "lastUpdated": "",
            "lessons": [],
            "onlyExercise": true,
            "media": [],
            "nowPlaying": "",
            "status": "ready",
            "statusText": "Ready",
            "users": [],
            "userAudioUrl": ""
        };
    }

    setControls(controls) {
        this.data.controls = controls;
    }

    setHelp(help) {
        this.data.help = help;
    }

    setParentElement(parentElement) {
        this.parentElement = parentElement;
    }

    setLoadingState(targetState) {
        let currentlyLoading = false;

        for (const property in notLoading) {
            if (property in targetState) {
                this.loadingState[property] = targetState[property];
            }

            if (this.loadingState[property]) {
                currentlyLoading = true;
            }
        }

        this.render();
    }

    setMimicCount(property, count) {
        this.mimicCount[property] = count;
    }

    setSelectedState(targetState) {
        for (const property in targetState) {
            this.selectedState[property] = targetState[property];
        }
    }

    setState(targetState) {
        for (const property in targetState) {
            this.state[property] = targetState[property];
        }
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
        const prevSelectedState = this.selectedState;
        this.setState({
            "status": "ready",
            "statusText": "Ready",
            "clickedAction": null
        });

        this.setMimicCount([prevSelectedState.exercises], prevMimicCount + 1);
    }

    /**
     * Pull the list of things to load from the config, and fetch them all
     *
     */
    fetchAll() {
        this.apiClient.checkToken();

        const thingsToLoad = this.config.api.models
            .filter(model => !model.local)
            .map(model => model.endpoint);

        thingsToLoad.forEach((endpoint) => {
            this.setLoadingState({[endpoint]: true});
            try {
                this.fetchData(endpoint);
            } catch (err) {
                this.handleFetchError(err);
                return;
            }
        });

        this.setState({"activity": "read"});
    }

    /**
     * Get a timestamp, compose an API url from the datatype and config, and
     * call fetchData in the API client.  Once the data is received, save it to
     * state.
     *
     * @param {string} dataType - the type of data to fetch from the API
     */
    async fetchData(dataType) {
        const loadTime = new moment();
        const apiUrl = [this.config.api.baseUrl, dataType].join("/");

        let res = {};
        try {
            res = await this.apiClient.fetchData(apiUrl);
        } catch (err) {
            this.handleFetchError(err);
        }

        this.data[dataType] = res;
        this.setState({"lastUpdated": loadTime.format()});

        this.setLoadingState({[dataType]: false});
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
            "id": 0,
            "title": title,
            "status": status,
            "message": message
        };
        console.log(alert);
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
    handleUnauthorized(titleText="Unauthorized on server") {
        const errorMessage = "Please try logging in again";
        if (!this.findAlert(titleText) && this.state.activity != "login") {
            this.addAlert(titleText, errorMessage);
            this.render();
        }

        this.logout();
    }

    /**
     * Handle 403 Forbidden errors.  Remove loading status and send an alert.
     *
     */
    handleForbidden() {
        const titleText = "Action forbidden";
        const errorMessage = "You do not have the right to do that";
        this.setState({"activity": "read"});
        this.setLoading(notLoading);

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
        console.log("handleFetchError", err);

        if ("status" in err && err.status === 401) {
            this.handleUnauthorized();
            return;
        }

        if ("status" in err && err.status === 403) {
            this.handleForbidden();
            return;
        }

        if ("statusText" in err) {
            this.addAlert("Fetch error", err.statusText);

            if (err.statusText === "Token has expired") {
                this.logout();
            }
            return;
        }

        if ("message" in err) {
            if (err.message === this.apiClient.expiredError) {
                this.handleUnauthorized(err.message);
                return;
            }

            if (err.message === "Token has expired"
            || err.message === "No access token in API client object"
            ) {
                this.logout();
            }

            return;

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
            this.setSelectedState({
                "exercises": null,
                "languages": null,
                "lessons": null,
                "media": null
            });
        }

        this.setState(targetState);
    }

    /**
     * If the token is well-formed, save it to state, along with the received
     * time and the expected token life
     *
     * @param {object} res - the server response including the token
     */
    handleToken(res) {
        const loadTime = new moment();
        if (!("access" in res)) {
            throw new Error("No token in response");
        }

        storageClient.setToken(res, loadTime.format());

        this.apiClient.setToken(res, loadTime.format());

        if (this.state.activity == "login") {
            this.setActivity("read");
            this.fetchAll();
        }
    }

    /**
     * If we have an error getting the token, handle that.
     *
     * @param {object} err - the error returned by the token method
     */
    handleTokenError(err) {
        console.log("handleTokenError", err);
        let alertText = "Please see the Javascript console";

        if ("statusText" in err) {
            alertText = err.statusText;
        }

        if (err.status === 400) {
            alertText = "Invalid username or password."
        }

        this.addAlert("Token error", alertText);
        this.logout();
    }

    /**
     * If we have an error logging in, handle that.
     *
     * @param {object} err - the error returned by the login method
     */
    handleLoginError(err) {
        let alertText = "There was an error logging you in.";

        if ("statusText" in err) {
            alertText = err.statusText;
        }

        if (err.status === 400) {
            alertText = "Invalid username or password."
        }

        this.addAlert("Unable to log in", alertText);
        this.render();
    }

    /**
     * Retrieve the username and password from the form, and then pass it to
     * the API login function
     *
     * @param {object} event - the click event passed by the browser
     */
    async loginClick(event) {
        event.preventDefault();
        const options = {
            "username": document.querySelector("#username").value,
            "password": document.querySelector("#password").value
        };

        let res = {};
        try {
            res = await this.apiClient.login(options);
        } catch (err) {
            console.log("login error", err);
            this.handleLoginError(err);
            return;
        }

        this.handleToken(res);
    }

    /**
     * Clear the user ID from state and set the activity to login
     *
     */
    logout() {
        storageClient.clearAll();
        this.setState({"activity": "login"});
        console.log("logout", this.state);
        this.data.currentUser = null;

        this.setLoadingState(notLoading);
        this.render();
    }

    /**
     * Remove an item from the queue
     *
     * @param {number} queueItemId - the index of the queue item to remove
     */
    removeFromQueue(queueItemId) {
        this.apiClient.delete(
            this.config.api.baseUrl, "queueItems", queueItemId
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
        this.apiClient.post(this.config.api.baseUrl, "queueItems", queueItem)
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
        this.apiClient.patch(this.config.api.baseUrl, itemType, payload, itemId)
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
        const prevSelectedState = this.selectedState;
        this.selectedState[prevSelectedState.itemType] = itemId;

        if (activity) {
            this.setState({"activity": activity});
        }

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
            && this.selectedState.lessons == lessonId) {
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
        const prevState = this.state;
        this.setState({"onlyExercise": !prevState.onlyExercise});
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

        if (!("mediaUrl" in mediaItem)) {
            this.addAlert("Media error", "Unable to find media for exercise!");
            return;
        }

        this.setState({
            "activity": "do",
            "mediaStatus": "loading",
            "nowPlaying": mediaItem.mediaUrl
        });

        const targetSelected = {"exercises": exerciseId};
        if (lessonId) {
            targetSelected.lessons = lessonId;
        }

        this.setSelected(targetSelected);
    }

    /**
     * Set an activity, and optionally select an exercise and lesson
     *
     * @param {string} activity - the selected activity
     * @param {number} exerciseId - the selected exercise (optional)
     * @param {number} lessonId - the selected lesson (optional)
     */
    setActivity(activity, exerciseId=null, lessonId=null) {
        this.state.activity = activity;

        this.setSelectedState({
            "exercises": exerciseId,
            "lessons": lessonId
        });
    }

    /**
     * Call the delete method in the API client to delete an item
     *
     * @param {string} itemType - the type of item to delete
     * @param {number} itemId - the ID of the item to delete
     */
    deleteClick(itemType, itemId) {
        this.apiClient.delete(this.config.api.baseUrl, itemType, itemId)
            .then(this.fetchAll.bind(this), this.handleFetchError);
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
            this.apiClient.patch(this.config.api.baseUrl, itemType, item, itemId)
                .then((res) => {
                    this.updateStateItem(res.response, itemType, "read", true);
                    this.fetchData(itemType);
                }, this.handleFetchError
            );
        } else {
            if (itemType === "lessons") {
                item.level = parseInt(item.level);
            }
            this.apiClient.post(this.config.api.baseUrl, itemType, item).then(
                (res) => {
                    this.updateStateItem(res.response, itemType, "read", true);
                    this.fetchData(itemType);
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
            this.config.api.baseUrl, "queueItems", {"item": itemId}, "up"
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
            this.config.api.baseUrl, "queueItems", {"item": itemId}, "down"
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
        if (!this.selectedState.lessons) {
            return 0;
        }

        const lesson = util.findItem(
            this.state.lessons, this.selectedState.lessons
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
            this.state.lessons, this.selectedState.lessons
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

        const prevState = this.state;
        this.setState({
            "activity": "loadExercise",
            "nowPlaying": mediaItem.mediaUrl
        });

        this.selectedState.exercises = queueItem.exercise;
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
    exportData(control, foo) {
        const apiUrl = [
            this.config.api.baseUrl, control.endpoint
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
            this.selectedState.exercises
        );

        const mediaItem = util.findItem(this.state.media, exercise.media);
        if (!("mediaUrl" in mediaItem)) {
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
        if (this.loadingState[this.selectedState.itemType]) {
            return "";
        }

        if (!this.data.currentUser
            || typeof this.data.currentUser !== 'object'
            || !("id" in this.data.currentUser)
        ) {
            const loginForm = new LoginForm();

            return loginForm.render(
                {
                    "help": this.data.help,
                    "loginClick": this.loginClick.bind(this)

                }
            );
        }

        const cardList = new CardList();
        return cardList.render({
            "activity": this.state.activity,
            "checkClick": this.checkClick,
            "data": this.data,
            "deleteClick": this.deleteClick.bind(this),
            "doButton": this.config.doButton,
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
            "loading": this.loadingState,
            "maxRank": this.maxRank.bind(this),
            "queueClick": this.queueClick.bind(this),
            "saveItem": this.saveItem.bind(this),
            "setActivity": this.setActivity.bind(this),
            "selected": this.selectedState,
            "selectItem": this.selectItem.bind(this),
            "startExercise": this.startExercise.bind(this),
            "toggleLesson": this.toggleLesson.bind(this)
        });
    }

    /**
     * Set the activity to read mode, selecting an itemType to display and
     * clearing the selected exercises and lessons
     *
     * @param {string} itemType - the type of item to select
     */
    readMode(itemType="lessons") {
        console.log("readMode", itemType);
        this.setState({
            "activity": "read",
            "clickedAction": null,
            "nowPlaying": null,
            "status": "ready",
            "statusText": ""
        });

        this.setSelectedState({
            "exercises": null,
            "itemType": itemType,
            "languages": null,
            "lessons": null,
            "media": null
        });

        this.render();
    }

    /** Display the navbar */
    nav() {
        const nav = new Navbar(this.config.ui);
        const props = {
            "currentUser": this.data.currentUser,
            "logout": this.logout.bind(this),
            "models": this.config.api.models,
            "navClick": this.readMode.bind(this),
            "selectedType": this.selectedState.itemType,
            "staffCanWrite": this.config.staffCanWrite,
            "version": this.config.version
        };

        return nav.render(props);
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
            this.state.lessons, this.selectedState.lessons
        );

        const infoArea = new InfoArea();

        return infoArea.render({
            "activity": this.state.activity,
            "alerts": this.state.alerts,
            "dismissAlert": this.dismissAlert.bind(this),
            "iso639": this.config.iso639,
            "lesson": lesson,
            "selectedType": this.selectedState.itemType,
            "setActivity": this.setActivity.bind(this)
        });
    }

    /**
     * Display the loadingModal
     *
     * @return {object}
     */
    loadingModal() {
        const localTypes = this.config.api.models
            .filter(model => model.local)
            .map(model => model.endpoint);

        const loadingModal = new LoadingModal();
        return loadingModal.render({
            "activity": this.state.activity,
            "itemType": this.selectedState.itemType,
            "loading": this.loadingState,
            "localTypes": localTypes
        });
    }

    /** The React render function, displaying the root element */
    render() {
        console.log("lab", JSON.stringify(this.state));
        try {
            const containerElement = document.createElement("div");
            containerElement.classList.add("container-fluid");

            const children = [
                this.nav(),
                this.infoArea(),
                this.body(),
                this.loadingModal()
            ];
            containerElement.append(...children);

            this.parentElement.replaceChildren(containerElement);
        } catch (err) {
            console.log("Error displaying lab", err);
        }
    }
};
