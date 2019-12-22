import CardList from "./cardList.js";
import Navbar from "./navbar.js";

import apiClient from "./apiClient.js";
import util from "./util.js";

import config from "./config.js";


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

        this.state = {
            "activity": "read",
            "lastUpdated": "",
            "loading": {
                "media": false,
                "users": false,
                "languages": false
            },
            "exercises": [],
            "lessons": [],
            "media": [],
            "users": [],
            "languages": [],
            "queueItems": [],
            "selectedItem": null,
            "selectedType": "queueItems"
        };
    }

    componentDidMount() {
        if (!this.state.lastUpdated) {
            this.setState({"loading": {
                "media": true,
                "languages": true,
                "users": true
            }});
            this.fetchData("queueItems");
            this.fetchData("exercises");
            this.fetchData("media");
            this.fetchData("users");
            this.fetchData("languages");
        }
    }

    fetchData(dataType) {
        const loadTime = new moment();
        const apiUrl = [
            config.api.baseUrl, dataType
        ].join("/");

        apiClient.fetchData(apiUrl).then((res) => {
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

    updateStateItem(res, itemType) {
        const items = [...this.state[itemType]];
        const index = items.findIndex((item) => item.id === res.id);

        if (index < 0) {
            items.push(res);
        } else {
            items[index] = res;
        }

        this.setState(
            {[itemType]: items}
        );
    }

    removeFromQueue(queueItemId) {
        this.deleteClick("queueItems", queueItemId);
    }

    addToQueue(exerciseId) {
        const queueItem = {
            "exercise": exerciseId
        };
        apiClient.post(queueItem, "queueItems").then((res) => {
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
        apiClient.patch(payload, itemType, itemId).then((res) => {
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

    setActivity(activity) {
        this.setState({"activity": activity});
    }

    deleteClick(itemType, itemId) {
        apiClient.delete(itemType, itemId).then((res) => {
            this.fetchData(itemType);
            this.fetchData("queueItems");
        }, (err) => {
            console.error(err);
        });
    }

    saveItem(item, itemType, itemId) {
        if (itemId) {
            apiClient.patch(item, itemType, itemId).then((res) => {
                this.updateStateItem(res.response, itemType);
                this.setState({"activity": "read"});
            }, (err) => {
                console.error(err);
            });
        } else {
            apiClient.post(item, itemType).then((res) => {
                this.updateStateItem(res.response, itemType);
                this.setState({"activity": "read"});
            }, (err) => {
                console.log(item);
                console.error(err);
            });
        }
    }

    up(itemId) {
        apiClient.patch({"item": itemId}, "queueItems", "up").then(res => {
            this.fetchData("queueItems");
        }, err => {
            console.error(err);
        });
    }

    down(itemId) {
        apiClient.patch({"item": itemId}, "queueItems", "down").then(res => {
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

    cardList() {
        return React.createElement(
            CardList,
            {
                "activity": this.state.activity,
                "checkClick": this.checkClick,
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
                "activeItem": "Queue",
                "itemType": config.api.endpoint,
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
            this.cardList()
        );
    }
}