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
            "type": this.props.clickId,
            "selectedItem": null
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
                {[dataType]: res, "lastUpdated": loadTime.format()}
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

    editItem = function(itemId) {
        this.setState({
            "activity": "edit",
            "selectedItem": itemId
        })
    }

    setActivity = function(activity) {
        this.setState({"activity": activity});
    }

    deleteClick = function() {
        console.log("deleteClick()");
    }

    saveItem = function(item, itemType, itemId) {
        console.log(`saveItem(${itemType}, ${itemId})`);
        if (itemId) {
            apiClient.patch(item, itemType, itemId).then((res) => {
                this.updateStateItem(res);
                this.setState({"activity": "read"});
            }, (err) => {
                console.error(err);
            });
        } else {
            console.log(item);
            const testItem = {
                "creator": item.creator,
                "format": item.format,
                "isAvailable": item.isAvailable,
                "isPublic": item.isPublic,
                "language": parseInt(item.language),
                "mediaUrl": item.mediaUrl,
                "name": item.name,
                "rights": item.rights
            };
            console.log(testItem);
            apiClient.post(testItem, itemType).then((res) => {
                this.updateStateItem(res);
                this.setState({"activity": "read"});
            }, (err) => {
                console.error(err);
            });
        }
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
                    "selectedItem": this.state.selectedItem,
                    "checkClick": this.checkClick.bind(this),
                    "setActivity": this.setActivity.bind(this),
                    "deleteClick": this.deleteClick.bind(this),
                    "saveItem": this.saveItem.bind(this),
                    "editItem": this.editItem.bind(this)
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