import CardList from "./cardList.js";
import LoginForm from "./loginForm.js";
import Navbar from "./navbar.js";

import LanguageLabClient from "./apiClient.js";
import util from "./util.js";

import config from "./config.js";
import environment from "./environment.js";

export default class Lab extends React.Component {
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
        this.apiClient.setToken(localStorage.getItem("token-auth"));

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
            "token": this.apiClient.token
        };
    }

    componentDidMount() {
        if (!this.state.lastUpdated && this.state.token) {
            this.fetchAll();
        }
    }

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

    fetchData(dataType) {
        const loadTime = new moment();
        const apiUrl = [
            environment.api.baseUrl, dataType
        ].join("/");

        const options = {
            "headers": {"Authorization": "JWT " + this.state.token}
        };

        this.apiClient.fetchData(apiUrl, options).then((res) => {
            this.setState(
                {
                    [dataType]: res,
                    "lastUpdated": loadTime.format(),
                    "loading": {[dataType]: false}
                }
            );
        }, (err) => {
            console.error(err);
        });
    }

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

    handleToken(res) {
        console.log(res);
        const loadTime = new moment();
        localStorage.setItem("token-auth", res.response.token);
        this.setState(
            {
                "token": res.response.token,
                "lastUpdated": loadTime.format(),
            }
        );
        this.fetchAll();
    }

    handleTokenError(err) {
        console.error(err);
        this.setState({"message": err.error.statusText});
    }

    loginClick(event) {
        const loadTime = new moment();
        const options = {
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value
        };

        this.apiClient.post(environment.api.baseUrl, "token-auth", options)
            .then(
                this.handleToken.bind(this), this.handleTokenError.bind(this)
        );
    }

    logout() {
        if (this.state.currentUser) {
            this.setState({"currentUser": null, "activity": "login"});
            return;
        }
    }

    removeFromQueue(queueItemId) {
        this.deleteClick("queueItems", queueItemId);
    }

    addToQueue(exerciseId) {
        const queueItem = {
            "exercise": exerciseId
        };
        this.apiClient.post(environment.api.baseUrl, "queueItems", queueItem).then(
            (res) => {
                this.fetchData("queueItems");
            }, (err) => {
                console.error(err);
        });
    }

    queueClick(operationName, id) {
        this.queueOperation[operationName](id);
    }

    checkClick(itemType, itemId, itemKey, itemChecked) {
        event.preventDefault();
        const payload = {[itemKey]: itemChecked};
        this.apiClient.patch(environment.api.baseUrl, itemType, payload, itemId)
            .then((res) => {
            this.updateStateItem(res, itemType);
        }, (err) => {
            console.error(err);
        });
    }

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
        }, (err) => {
            console.error(err);
        });
    }

    saveItem(item, itemType, itemId) {
        if (itemId) {
            this.apiClient.patch(environment.api.baseUrl, itemType, item, itemId)
                .then((res) => {
                this.updateStateItem(res.response, itemType, "read", false);
            }, (err) => {
                console.error(err);
            });
        } else {
            this.apiClient.post(environment.api.baseUrl, itemType, item).then(
                (res) => {
                    this.updateStateItem(res.response, itemType, "read", true);
                }, (err) => {
                    console.error(err);
                }
            );
        }
    }

    up(itemId) {
        this.apiClient.patch(
            environment.api.baseUrl, "queueItems", {"item": itemId}, "up"
        ).then(res => {
            this.fetchData("queueItems");
        }, err => {
            console.error(err);
        });
    }

    down(itemId) {
        this.apiClient.patch(
            environment.api.baseUrl, "queueItems", {"item": itemId}, "down"
        ).then(res => {
            this.fetchData("queueItems");
        }, err => {
            console.error(err);
        });
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
        console.log(this.state);
        return React.createElement(
            "div",
            {"className": "container"},
            this.nav(),
            this.body()
        );
    }
}