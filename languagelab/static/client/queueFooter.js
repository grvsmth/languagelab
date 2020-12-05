import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

const timeFormat = "HH:mm:ss.S";


export default class QueueFooter extends React.Component {
    constructor(props) {
        super(props);

        this.queueClick = this.queueClick.bind(this);
    }

    rankBadge() {
        return React.createElement(
            "span",
            {"className": "badge badge-success"},
            this.props.queueItem.rank
        );
    }

    addClick(event) {
        const inputSelector = ["#lesson", this.props.exerciseId].join("_");
        const lessonId = parseInt(document.querySelector(inputSelector).value);

        this.props.queueClick("add", this.props.exerciseId, lessonId);
    }

    queueClick(event) {
        const idParts = event.currentTarget.id.split("_");
        if (!idParts) {
            return;
        }

        this.props.queueClick(idParts[0], this.props.queueItem.id);
    }

    rankButton(buttonContent) {
        var disabled = false;
        if (buttonContent === "up" && this.props.queueItem.rank <= 1) {
            disabled = true;
        }

        if (buttonContent === "down"
            && this.props.queueItem.rank >= this.props.maxRank) {
            disabled = true;
        }
        const iconClass = config.queueButton[buttonContent]["icon"];
        const btnClass = "btn-" + config.queueButton[buttonContent]["color"];
        const buttonId = [buttonContent, this.props.queueItem.id].join("_");

        return React.createElement(
            "button",
            {
                "className": "btn " + btnClass,
                "disabled": disabled,
                "id": buttonId,
                "key": "rank-button-" + buttonContent,
                "onClick": this.queueClick,
                "type": "button"
            },
            commonElements.iconSpan(iconClass)
        );
    }

    badgeSpan() {
        return React.createElement(
            "span",
            {},
            this.rankBadge(),
            " in queue "
        );
    }

    addButton() {
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn btn-success btn-sm ml-2",
                "id": "add",
                "onClick": this.addClick.bind(this)
            },
            "Add to lesson",
        );
    }

    firstLesson() {
        if (!this.props.exerciseLessons.length) {
            return null;
        }

        return this.props.exerciseLessons[0].lesson;
    }

    lessonSpan() {
        const inputId = ["lesson", this.props.exerciseId].join("_");

        return React.createElement(
            "span",
            {"className": "d-inline-block"},
            commonElements.itemSelect(
                "lesson",
                util.listToObject(this.props.lessons),
                inputId,
                this.firstLesson()
            )
        );
    }

    lessonMessage() {
        return React.createElement(
            "div",
            {"className": "card-footer"},
            config.message.lessonQueue
        )
    }

    exerciseLessons() {
        if (!this.props.exerciseLessons) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "mr-2"},
            `In ${this.props.exerciseLessons.length} lessons`
        );
    }

    addFooter() {
        if (!this.props.lessons) {
            return this.lessonMessage();
        }

        return React.createElement(
            "div",
            {"className": "card-footer"},
            this.exerciseLessons(),
            this.lessonSpan(),
            this.addButton(),
        );
    }

    rankButtonGroup() {
        return React.createElement(
            "div",
            {
                "className": "btn-group btn-group-sm",
                "role": "group"
            },
            Object.keys(config.queueButton).map(this.rankButton, this)
        );
    }

    render() {
        if (!this.props.queueItem) {
            return this.addFooter();
        }

        return React.createElement(
            "div",
            {"className": "card-footer"},
            this.badgeSpan(),
            this.rankButtonGroup()
        );
    }
}