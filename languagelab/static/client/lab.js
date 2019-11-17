import CardList from "./cardList.js";
import apiClient from "./apiClient.js";
import util from "./util.js";

import config from "./config.js";


export default class Lab extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);

        this.checkClick = this.checkClick.bind(this);
        this.queueOperation = {
            "add": this.addToQueue.bind(this),
            "remove": this.removeFromQueue.bind(this),
            "up": this.up.bind(this),
            "down": this.down.bind(this)
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
            "selectedItem": null
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
        console.log(`queueOperation[${operationName}](${id})`);
        this.queueOperation[operationName](id);
    }

    checkClick = function(itemType, itemId, itemKey, itemChecked) {
        event.preventDefault();
        const payload = {[itemKey]: itemChecked};
        apiClient.patch(payload, itemType, itemId).then((res) => {
            this.updateStateItem(res, itemType);
        }, (err) => {
            console.error(err);
        });
    }

    editItem = function(itemId) {
        this.setState({
            "activity": "edit",
            "selectedItem": itemId
        })
    }

    startExercise(exerciseId) {
        this.setState({
            "activity": "do",
            "selectedItem": exerciseId
        });
    }

    setActivity = function(activity) {
        this.setState({"activity": activity});
    }

    deleteClick = function(itemType, itemId) {
        apiClient.delete(itemType, itemId).then((res) => {
            this.fetchData(itemType);
        }, (err) => {
            console.error(err);
        });
    }

    saveItem = function(item, itemType, itemId) {
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

    render() {
        console.log(this.state);

        return React.createElement(
            CardList,
            {
                "activity": this.state.activity,
                "exercises": this.state.exercises,
                "lessons": this.state.lessons,
                "queueItems": this.state.queueItems,
                "media": this.state.media,
                "users": this.state.users,
                "languages": this.state.languages,
                "selectedItem": this.state.selectedItem,
                "checkClick": this.checkClick,
                "setActivity": this.setActivity.bind(this),
                "deleteClick": this.deleteClick.bind(this),
                "saveItem": this.saveItem.bind(this),
                "editItem": this.editItem.bind(this),
                "startExercise": this.startExercise.bind(this),
                "queueClick": this.queueClick.bind(this),
                "loading": this.state.loading,
                "selectedType": this.props.selectedType,
            },
            null
        );
    }
}