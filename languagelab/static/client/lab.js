import MediaCardList from "./mediaCardList.js";
import apiClient from "./apiClient.js";

import config from "./config.js";


export default class Lab extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);

        this.state = {
            "lastUpdated": "",
            "media": []
        };
    }

    fetchData(dataType) {
        const loadTime = new moment();
        const apiUrl = [
            config.api.baseUrl, dataType
        ].join("/");

        apiClient.fetchData(apiUrl).then((res) => {
            console.log("results", res.results);
            this.setState(
                {[dataType]: res.results, "lastUpdated": loadTime.format()}
                );
        }, (err) => {
            console.error(err);
        });
    }

    componentDidMount() {
        if (!this.state.lastUpdated) {
            this.fetchData("media");
        }
    }

    checkClick = function(event) {
        event.preventDefault();
        console.dir(event.target);
    }

    render() {
        console.log(this.state);

        if (this.props.clickId === "media") {
            return React.createElement(
                MediaCardList,
                {"media": this.state.media, "checkClick": this.checkClick},
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