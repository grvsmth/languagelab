import config from "./config.js";
import commonElements from "./commonElements.js";
import util from "./util.js";

export default class LessonCard extends React.Component {
    constructor(props) {
        super(props);

        this.checkboxClick = this.checkboxClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.editClick = this.editClick.bind(this);
    }

    itemTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.lesson.name
        );
    }

    bySpan() {
        if (!this.props.users || this.props.users.length < 1) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-info"},
            " by ",
            this.props.users[0].username
        );
    }

    itemSubtitle() {
        const createdText = new moment(this.props.lesson.created)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-dark"},
            `${this.props.lesson.description} (created ${createdText}`,
            this.bySpan(),
            ")"
        );
    }

    checkboxClick(event) {
        this.props.checkClick(
            "lesson",
            this.props.lesson.id,
            event.target.name,
            event.target.checked
        )
    }

    editClick(event) {
        this.props.editItem(this.props.lesson.id);
    }

    deleteClick(event) {
        this.props.deleteClick("lesson", this.props.lesson.id);
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

    tagBadge(tagText) {
        return React.createElement(
            "span",
            {"className": "badge badge-pill badge-info mr-1"},
            tagText
        );
    }

    tagsSpan() {
        if (this.props.lesson.tags.length < 1) {
            return null;
        }

        return React.createElement(
            "span",
            {},
            ...this.props.lesson.tags.map((tag) => {
                return this.tagBadge(tag);
            })
        );
    }

    linkDiv() {
        if (this.props.activity === "add") {
            return null;
        }
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
            this.tagsSpan(),
            commonElements.checkboxDiv(
                "isAvailable",
                this.props.lesson.isAvailable,
                "available",
                this.props.lesson.id,
                this.checkboxClick
                ),
            commonElements.checkboxDiv(
                "isPublic",
                this.props.lesson.isPublic,
                "public",
                this.props.lesson.id,
                this.checkboxClick
                ),
            this.linkDiv()
        );
    }

    render() {
        console.log("render", this.props);
        return React.createElement(
            "div",
            {"className": "card border-secondary bg-light mb-3"},
            this.cardBody()
        );
    }

}