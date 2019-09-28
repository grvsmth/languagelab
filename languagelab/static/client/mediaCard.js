import config from "./config.js";

export default class MediaCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    itemTitle() {
        const formatText = config.formatName[this.props.mediaItem.format];
        return React.createElement(
            "h5",
            {"className": "card-title"},
            `${this.props.mediaItem.name} (${formatText}, ${this.props.mediaItem.duration})`
        );
    }

    itemSubtitle() {
        const uploadedText = new moment(this.props.mediaItem.uploaded)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-muted"},
            `${this.props.mediaItem.creator} (added ${uploadedText})`
        );
    }

    rightsSpan() {
        return React.createElement(
            "span",
            {"className": "card-text mr-2"},
            this.props.mediaItem.rights
        );
    }

    checkboxClick(event) {
        console.log("checkboxClick()", event);
    }

    checkboxInput(key, inputId) {
        return React.createElement(
            "input",
            {
                "className": "form-check-input",
                "type": "checkbox",
                "onClick": this.checkboxClick,
                "onChange": this.checkboxClick,
                "id": inputId,
                "name": key,
                "checked": this.props.mediaItem[key]
            },
            null
        );
    }

    checkboxLabel(inputId, labelText) {
        return React.createElement(
            "label",
            {"htmlFor": inputId},
            labelText
        );
    }

    checkboxDiv(key, labelText) {
        const inputId = [key, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "form-check form-check-inline"},
            this.checkboxInput(key, inputId),
            this.checkboxLabel(inputId, labelText)
        );
    }

    editClick(event) {
        console.log("editClick");
    }

    deleteClick(event) {
        console.log("deleteClick");
    }

    editLink() {
        return React.createElement(
            "a",
            {"className": "text-primary", "onClick": this.editClick},
            "edit"
        );
    }

    deleteLink() {
        return React.createElement(
            "a",
            {"className": "text-danger", "onClick": this.deleteClick},
            "delete"
        );
    }

    linkDiv() {
        return React.createElement(
            "div",
            {},
            this.editLink(),
            " ",
            this.deleteLink()
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            this.itemSubtitle(),
            this.rightsSpan(),
            this.checkboxDiv("isAvailable", "available"),
            this.checkboxDiv("isPublic", "public"),
            this.linkDiv()
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "card bg-light"},
            this.cardBody()
        );
    }

}