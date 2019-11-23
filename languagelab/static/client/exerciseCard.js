import config from "./config.js";
import commonElements from "./commonElements.js";

import ExerciseCardBody from "./exerciseCardBody.js";
import QueueFooter from "./queueFooter.js";
import util from "./util.js";

const timeFormat = "HH:mm:ss.S";

export default class ExerciseCard extends React.Component {
    constructor(props) {
        super(props);
    }

    queueBody(item) {
        if (!this.props.item.hasOwnProperty("name")) {
            return null;
        }

        return React.createElement(
            "div",
            {"className": "card-body"},
            `Loading exercise ${item.exercise}`
        );

    }

    cardBody() {
        if (!this.props.item.hasOwnProperty("name")) {
            return this.queueBody(this.props.item);
        }

        return React.createElement(
            ExerciseCardBody,
            {
                "checkClick": this.props.checkClick,
                "editItem": this.props.editItem,
                "exercise": this.props.item,
                "languages": this.props.languages,
                "mediaItem": this.props.mediaItem,
                "queueClick": this.props.queueClick,
                "startExercise": this.props.startExercise,
                "users": this.props.users
            },
            null
        );
    }

    cardFooter() {
        if (!this.props.item.hasOwnProperty("name")) {
            return null;
        }

        return React.createElement(
            QueueFooter,
            {
                "exerciseId": this.props.item.id,
                "queueItem": this.props.queueItem,
                "queueClick": this.props.queueClick
            },
            null
        );
    }

    render() {
        console.log("props", this.props);
        return React.createElement(
            "div",
            {"className": "card bg-light"},
            this.cardBody(),
            this.cardFooter()
        );
    }
}