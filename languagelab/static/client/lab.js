import MediaCardList from "./mediaCardList.js";
import apiClient from "./apiClient.js";
import util from "./util.js";

import config from "./config.js";


export default class Lab extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);

        this.state = {
            "lastUpdated": "",
            "loading": {
                "media": false,
                "users": false,
                "languages": false
            },
            "media": [],
            "users": [],
            "languages": [],
            "activity": "read",
            "type": this.props.selectedType,
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

    render() {
        console.log(this.state);

        if (this.props.selectedType === "media") {
            return React.createElement(
                MediaCardList,
                {
                    "activity": this.state.activity,
                    "media": this.state.media,
                    "users": this.state.users,
                    "languages": this.state.languages,
                    "selectedItem": this.state.selectedItem,
                    "checkClick": this.checkClick.bind(this),
                    "setActivity": this.setActivity.bind(this),
                    "deleteClick": this.deleteClick.bind(this),
                    "saveItem": this.saveItem.bind(this),
                    "editItem": this.editItem.bind(this),
                    "loading": this.state.loading
                },
                null
            )
        }

        if (!this.props.clickId) {
            return React.createElement(
                "div",
                {},
                "React is running"
            )
        }

        return React.createElement(
            "div",
            {},
            `You clicked ${this.props.clickId}`
        );
    }
}