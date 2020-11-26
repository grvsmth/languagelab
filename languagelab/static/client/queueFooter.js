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

    queueClick(event) {
        const idParts = event.currentTarget.id.split("_");
        if (!idParts) {
            return;
        }
        var id = this.props.exerciseId
        if (idParts[0] !== "add") {
            id = this.props.queueItem.id;
        }
        this.props.queueClick(idParts[0], id);
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
                "className": "btn btn-success btn-sm",
                "id": "add",
                "onClick": this.queueClick
            },
            "Add to lesson",
        );
    }

    addFooter() {

        const inputId = ["lesson", this.props.exerciseId].join("_");

        return React.createElement(
            "div",
            {"className": "card-footer"},
            commonElements.itemSelect(
                "lesson",
                this.props.lessons,
                inputId,
                null
            ),
            this.addButton()
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