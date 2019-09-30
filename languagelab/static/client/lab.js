import MediaCardList from "./mediaCardList.js";
import apiClient from "./apiClient.js";

import config from "./config.js";


export default class Lab extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);

        this.state = {
            "lastUpdated": "",
            "media": [],
            "users": [],
            "languages": [],
            "activity": "read",
            "type": this.props.clickId
        };
    }

    componentDidMount() {
        if (!this.state.lastUpdated) {
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
                {[dataType]: res.results, "lastUpdated": loadTime.format()}
                );
        }, (err) => {
            console.error(err);
        });
    }

    updateStateItem(res) {
        const items = [...this.state[res.type]];
        const index = items.findIndex((item) => item.id === res.response.id);
        items[index] = res.response;

        this.setState(
            {[res.type]: items}
        );
    }

    checkClick = function(itemType, itemId, itemKey, itemChecked) {
        event.preventDefault();
        const payload = {[itemKey]: itemChecked};
        apiClient.patch(payload, itemType, itemId).then((res) => {
            this.updateStateItem(res);
        }, (err) => {
            console.error(err);
        });
    }

    setActivity = function(activity) {
        this.setState({"activity": activity});
    }

    deleteClick = function() {
        console.log("deleteClick()");
    }

    saveItem = function(item, itemType, itemId) {
        console.log(item);
        const testItem = {
            "language": item.language,
            "isAvailable": item.isAvailable,
            "isPublic": item.isPublic
        }
        apiClient.patch(testItem, itemType, itemId).then((res) => {
            this.updateStateItem(res);
            this.setState({"activity": "read"});
        }, (err) => {
            console.error(err);
        });
    }

    render() {
        console.log(this.state);

        if (this.props.clickId === "media") {
            return React.createElement(
                MediaCardList,
                {
                    "activity": this.state.activity,
                    "media": this.state.media,
                    "users": this.state.users,
                    "languages": this.state.languages,
                    "checkClick": this.checkClick.bind(this),
                    "setActivity": this.setActivity.bind(this),
                    "deleteClick": this.deleteClick.bind(this),
                    "saveItem": this.saveItem.bind(this)
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