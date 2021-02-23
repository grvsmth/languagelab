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
    /**
     * Bind methods, instantiate API client and set sefault state
     *
     */
    constructor(props) {
        super(props);

        this.checkClick = this.checkClick.bind(this);
        this.handleFetchError = this.handleFetchError.bind(this);
        this.handleToken = this.handleToken.bind(this);

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

        const storageData = storageClient.storedData();

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
            "loading": {},
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
        this.setState({"loading": loading});
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
        this.setState({"loading": {}});
        if (!this.findAlert(titleText) && this.state.activity != "login") {
            this.addAlert(titleText, errorMessage);
        }
    }

    /**
     * Handle fetch errors.  If the token is expired, then make the user log
     * in again.
     *
     * TODO There's some confusion about the format of various errors that get passed
     * to this function.  Until we have it sorted out, let's keep the log
     * statements.
     *
     * @param {object} err - The error object
     */
    handleFetchError(err) {
        if (err.status === 401) {
            this.handleUnauthorized();
            return;
        }

        if (err.statusText) {
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
        if (!Object.prototype.hasOwnProperty.call(res, "response")) {
            throw new Error("No token response!");
        }
        if (!Object.prototype.hasOwnProperty.call(res.response, "token")) {
            throw new Error("No token in response!");
        }

        storageClient.setToken(
            res.response.token, loadTime.format(), res.response.expiresIn
        );

        this.apiClient.setToken(
            res.response.token, loadTime.format(), res.response.expiresIn
        );
        this.fetchAll();
    }

    /*

        If we have an error getting the token, handle that.

    */
    handleTokenError(err) {
        console.error(err);
        this.addAlert("Token error", err);
    }

    /*

        Retrieve the username and password from the form, and then pass it to
        the API login function

    */
    loginClick(event) {
        event.preventDefault();
        const options = {
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value
        };

        this.apiClient.login(options).then((res) => {
                this.handleToken(res);
            },
            this.handleTokenError.bind(this)
        );
    }

    /*

        Clear the user ID from state and set the activity to login

    */
    logout() {
        if (this.state.currentUser) {
            storageClient.logout();
            this.setState({
                "activity": "login",
                "currentUser": null
            });
            return;
        }
    }

    /*

        Remove an item from the queue

    */
    removeFromQueue(queueItemId) {
        this.apiClient.delete(
            environment.api.baseUrl, "queueItems", queueItemId
        ).then(() => {this.fetchData("lessons");}, this.handleFetchError
        );
    }

    /*

        Add an exercise to the queue

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

    /*

        Handle various queue operations: add, remove, up, down.  These are
        specified in an Object.

    */
    queueClick(operationName, id, lessonId=null) {
        this.queueOperation[operationName](id, lessonId);
    }

    /**
     * Handle a click on a checkbox: update the API and save state
     *
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

    /*

        Select an item.  Used when playing media in mediaCard.js, and when
        starting the edit activity

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

    firstExerciseId(lessonId) {
        const lesson = util.findItem(this.state.lessons, lessonId);

        if (!lesson.queueItems) {
            return null;
        }

        return lesson.queueItems[0].exercise;
    }

    toggleLesson(lessonId) {
        if (this.state.activity === "do"
            && this.state.selected.lessons == lessonId) {
            this.readMode();
            return;
        }
        this.startExercise(this.firstExerciseId(lessonId), lessonId);
    }

    toggleOnlyExercise() {
        this.setState(prevState => ({"onlyExercise": !prevState.onlyExercise}));
    }

    onMediaLoaded() {
        this.setState({
            "mediaStatus": "ready"
        });
    }

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

    deleteClick(itemType, itemId) {
        this.apiClient.delete(environment.api.baseUrl, itemType, itemId)
            .then(this.fetchAll, this.handleFetchError);
    }

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

    up(itemId) {
        this.apiClient.patch(
            environment.api.baseUrl, "queueItems", {"item": itemId}, "up"
        ).then(
            () => {this.fetchData("lessons");}, this.handleFetchError
        );
    }

    down(itemId) {
        this.apiClient.patch(
            environment.api.baseUrl, "queueItems", {"item": itemId}, "down"
        ).then(
            () => {this.fetchData("lessons");}, this.handleFetchError
        );
    }

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

    previous(rank) {
        if (rank <= 1) {
            return;
        }
        this.selectByRank(rank - 1);
    }

    next(rank) {
        if (rank >= this.maxRank()) {
            return;
        }
        this.selectByRank(rank + 1);
    }

    handleExportData(res, mimeType) {
        const blob = new Blob([JSON.stringify(res)], {"type": mimeType});
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
    }

    exportData(control) {
        const apiUrl = [
            environment.api.baseUrl, control.endpoint
        ].join("/");

        this.apiClient.fetchData(apiUrl).then((res) => {
                this.handleExportData(res, control.mimeType);
        }, this.handleFetchError.bind(this));
    }

    playMimic() {
        this.setState({
            "nowPlaying": this.state.userAudioUrl,
            "status": "playMimic",
            "statusText": "Now playing recorded audio"
        });
    }

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

    readMode(itemType="lessons") {
        this.setState((prevState) => ({
            "activity": "read",
            "clickedAction": null,
            "nowPlaying": null,
            "selected": {
                ...prevState.selected,
                "exercises": null,
                "itemType": itemType,
                "lessons": null
            },
            "status": "ready",
            "statusText": ""
        }));
    }

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

    dismissAlert(id) {
        const alerts = [...this.state.alerts];
        const alertIndex = alerts.findIndex((alert) => alert.id == id);

        alerts.splice(alertIndex, 1);
        this.setState({"alerts": alerts});
    }

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

    loadingModal() {
        return React.createElement(
            LoadingModal,
            {
                "itemType": this.state.selected.itemType,
                "loading": this.state.loading
            }
        );
    }

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