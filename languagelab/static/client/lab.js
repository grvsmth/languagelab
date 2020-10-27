/*

    Main page for Language Lab, with state handling

*/
import CardList from "./cardList.js";
import LoginForm from "./loginForm.js";
import Navbar from "./navbar.js";

import LanguageLabClient from "./apiClient.js";
import util from "./util.js";

import config from "./config.js";
import environment from "./environment.js";

export default class Lab extends React.Component {
    /*

        Bind methods, instantiate API client and set sefault state

    */
    constructor(props) {
        super(props);

        this.checkClick = this.checkClick.bind(this);
        this.navClick = this.navClick.bind(this);

        this.queueOperation = {
            "add": this.addToQueue.bind(this),
            "remove": this.removeFromQueue.bind(this),
            "up": this.up.bind(this),
            "down": this.down.bind(this)
        };

        this.queueNav = {
            "previous": this.previous.bind(this),
            "exit": this.exitDo.bind(this),
            "next": this.next.bind(this)
        };

        this.apiClient = new LanguageLabClient();
        this.apiClient.setBaseUrl(environment.api.baseUrl);
        this.apiClient.setHandleToken(this.handleToken.bind(this));

        this.state = {
            "activity": "read",
            "exercises": [],
            "languages": [],
            "lastUpdated": "",
            "lessons": [],
            "loading": {},
            "loggedIn": false,
            "media": [],
            "message": "",
            "queueItems": [],
            "selectedItem": null,
            "selectedType": "queueItems",
            "users": [],
            "token": "",
            "tokenExpired": false
        };
    }

    /*

        If we haven't fetched anything yet, fetch it all

    */
    componentDidMount() {
        if (!this.state.lastUpdated && this.state.token) {
            this.fetchAll();
        }
    }

    /*

        Pull the list of things to load from the config, and fetch them all

    */
    fetchAll() {
        const loading = {};

        const thingsToLoad = Object.values(config.api.endpoint).concat(
            ["currentUser", "users"]
        );

        thingsToLoad.forEach((endpoint) => {
            loading[endpoint] = true;
            this.fetchData(endpoint);
        });
        this.setState({"loading": loading});
    }

    /*

        Get a timestamp, compose an API url from the datatype and config, and
        call fetchData in the API client.  Once the data is received, save it to
        state.

    */
    fetchData(dataType) {
        const loadTime = new moment();
        const apiUrl = [
            environment.api.baseUrl, dataType
        ].join("/");

        this.apiClient.fetchData(apiUrl).then((res) => {
            this.setState(
                {
                    [dataType]: res,
                    "lastUpdated": loadTime.format(),
                    "loading": {[dataType]: false}
                }
            );
        }, (err) => {
            this.handleFetchError(
                {"type": dataType, "error": err}
            );
        });
    }

    /*

        Handle fetch errors.  If the token is expired, then make the user log
        in again.

    */
    handleFetchError(err) {
        if (err.error.message === this.apiClient.expiredError) {
            this.logout();
            return;
        }
        console.log("message", err.error.message);
    }


    /*

        Update specific state items when received from the API

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
            targetState.selectedItem = null;
        }

        this.setState(targetState);
    }

    /*

        If the token is well-formed, save it to state, along with the received
        time and the expected token life

    */
    handleToken(res) {
        const loadTime = new moment();
        if (!res.hasOwnProperty("response")) {
            throw new Error("No response property!");
        }
        if (!res.response.hasOwnProperty("token")) {
            throw new Error("No token in response!");
        }

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
        this.setState({"message": err.statusText});
    }

    /*

        Retrieve the username and password from the form, and then pass it to
        the API login function

    */
    loginClick(event) {
        const options = {
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value
        };

        this.apiClient.login(options).then(
            this.handleToken.bind(this), this.handleTokenError.bind(this)
        );
    }

    /*

        Clear the user ID from state and set the activity to login

    */
    logout() {
        if (this.state.currentUser) {
            this.setState({"currentUser": null, "activity": "login"});
            return;
        }
    }

    /*

        Remove an item from the queue

    */
    removeFromQueue(queueItemId) {
        this.deleteClick("queueItems", queueItemId);
    }

    /*

        Add an exercise to the queue

    */
    addToQueue(exerciseId) {
        const queueItem = {
            "exercise": exerciseId
        };
        this.apiClient.post(environment.api.baseUrl, "queueItems", queueItem).then(
            (res) => {
                this.fetchData("queueItems");
            }, this.handleFetchError
        );
    }

    /*

        Handle various queue operations: add, remove, up, down.  These are
        specified in an Object.

    */
    queueClick(operationName, id) {
        this.queueOperation[operationName](id);
    }

    /*

        Handle a click on a checkbox: update the API and save state

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

        Select an item and put the interface into edit mode

    */
    editItem(itemId) {
        var queueItem;
        if (this.state.selectedType === "queueItems") {
            queueItem = this.state.queueItems.find(
                (queueItem) => queueItem.exercise === itemId
            );
        }

        const selectedItem = queueItem ? queueItem.id : itemId;
        this.setState({
            "activity": "edit",
            "selectedItem": selectedItem
        })
    }

    /*

        Select an item.  Used when playing media in mediaCard.js

    */
    selectItem(itemId) {
        this.setState({"selectedItem": itemId});
    }

    startExercise(exerciseId) {
        var queueItem;
        if (this.state.selectedType === "queueItems") {
            queueItem = this.state.queueItems.find(
                (queueItem) => queueItem.exercise === exerciseId
            );
        }
        const selectedItem = queueItem ? queueItem.id : exerciseId;
        this.setState({
            "activity": "do",
            "selectedItem": selectedItem
        });
    }

    setActivity(activity, itemId=null) {
        var targetState = {"activity": activity};
        if (itemId) {
            targetState.selectedItem = itemId;
        }
        this.setState(targetState);
    }

    deleteClick(itemType, itemId) {
        this.apiClient.delete(environment.api.baseUrl, itemType, itemId).then((res) => {
            this.fetchData(itemType);
            this.fetchData("queueItems");
        }, this.handleFetchError
        );
    }

    saveItem(item, itemType, itemId) {
        if (itemId) {
            this.apiClient.patch(environment.api.baseUrl, itemType, item, itemId)
                .then((res) => {
                this.updateStateItem(res.response, itemType, "read", false);
            }, (err) => {
                this.handleFetchError(err);
            });
        } else {
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
        ).then(res => {
            this.fetchData("queueItems");
        }, this.handleFetchError
        );
    }

    down(itemId) {
        this.apiClient.patch(
            environment.api.baseUrl, "queueItems", {"item": itemId}, "down"
        ).then(res => {
            this.fetchData("queueItems");
        }, this.handleFetchError
        );
    }

    maxRank() {
        if (this.state.queueItems.length < 1) {
            return 0;
        }

        const last = this.state.queueItems[this.state.queueItems.length - 1];
        return last.rank;
    }

    selectByRank(rank) {
        const queueItem = this.state.queueItems.find(
            (queueItem) => queueItem.rank === rank
        );

        const selectedItem = this.state.selectedType === "queueItems"
            ? queueItem.id : queueItem.exercise;

        this.setState({"selectedItem": selectedItem});
    }

    previous(rank) {
        if (rank <= 1) {
            return;
        }
        this.selectByRank(rank - 1);
    }

    exitDo() {
        this.setState({"activity": "read", "selectedItem": null});
    }

    next(rank) {
        if (rank >= this.maxRank()) {
            return;
        }
        this.selectByRank(rank + 1);
    }

    body() {
        if (!this.state.currentUser) {
            return React.createElement(
                LoginForm,
                {
                    "loginClick": this.loginClick.bind(this),
                    "message": this.state.message
                },
                null
            );
        }
        return React.createElement(
            CardList,
            {
                "activity": this.state.activity,
                "checkClick": this.checkClick,
                "currentUser": this.currentUser,
                "deleteClick": this.deleteClick.bind(this),
                "doButton": config.doButton,
                "editItem": this.editItem.bind(this),
                "exercises": this.state.exercises,
                "exitDo": this.exitDo.bind(this),
                "languages": this.state.languages,
                "lessons": this.state.lessons,
                "loading": this.state.loading,
                "maxRank": this.maxRank.bind(this),
                "media": this.state.media,
                "queueClick": this.queueClick.bind(this),
                "queueItems": this.state.queueItems,
                "queueNav": this.queueNav,
                "saveItem": this.saveItem.bind(this),
                "setActivity": this.setActivity.bind(this),
                "startExercise": this.startExercise.bind(this),
                "selectItem": this.selectItem.bind(this),
                "selectedItem": this.state.selectedItem,
                "selectedType": this.state.selectedType,
                "users": this.state.users
            },
            null
        );
    }

    navClick(itemType) {
        this.setState(
            {
                "activity": "read",
                "selectedItem": null,
                "selectedType": itemType
            }
        );
    }

    nav() {
        return React.createElement(
            Navbar,
            {
                "activeItem": this.state.selectedType,
                "currentUser": this.state.currentUser,
                "itemType": config.api.endpoint,
                "logout": this.logout.bind(this),
                "navClick": this.navClick
            },
            null
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "container"},
            this.nav(),
            this.body()
        );
    }
}