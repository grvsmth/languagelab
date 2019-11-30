import apiClient from "./apiClient.js";
import util from "./util.js";
import config from "./config.js";

import Navbar from "./navbar.js";
import Lab from "./lab.js";


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "selectedType": "queueItems"
        };

        this.navClick = this.navClick.bind(this);
    }

    navClick(itemType) {
        this.setState({"selectedType": itemType});
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

    lab() {
        return React.createElement(
            Lab,
            {
                "selectedType": this.state.selectedType
            },
            null
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "container-fluid"},
            this.nav(),
            this.lab()
        );
    }
}