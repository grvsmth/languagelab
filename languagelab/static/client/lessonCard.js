import config from "./config.js";
import commonElements from "./commonElements.js";
import DoExerciseCard from "./doExerciseCard.js";
import util from "./util.js";

export default class LessonCard extends React.Component {
    constructor(props) {
        super(props);

        this.checkboxClick = this.checkboxClick.bind(this);
    }

    toggleLesson() {
        this.props.toggleLesson(this.props.lesson.id);
    }

    itemTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.lesson.name
        );
    }

    bySpan() {
        if (!this.props.itemUser) {
            return null;
        }

        return React.createElement(
            "span",
            {"className": "text-info"},
            this.props.itemUser.username
        );
    }

    itemSubtitle() {
        const createdText = new moment(this.props.lesson.created)
            .format(config.dateTimeFormat);

        return React.createElement(
            "h6",
            {"className": "card-subtitle text-dark"},
            `${this.props.lesson.description} (level ${this.props.lesson.level},
              created ${createdText} by `,
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
        this.props.selectItem(this.props.lesson.id, "edit");
    }

    deleteClick(event) {
        this.props.deleteClick("lessons", this.props.lesson.id);
    }

    editLink() {
        return React.createElement(
            "a",
            {"className": "text-primary", "onClick": this.editClick.bind(this)},
            "edit"
        );
    }

    deleteLink() {
        return React.createElement(
            "a",
            {
                "className": "text-danger",
                "onClick": this.deleteClick.bind(this)
            },
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

    tagsDiv() {
        if (this.props.lesson.tags.length < 1) {
            return null;
        }

        return React.createElement(
            "div",
            {"className": "my-2"},
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

    notesDiv() {
        return React.createElement(
            "div",
            {},
            this.props.lesson.notes
        );
    }

    doQueueButton() {
        if (this.props.lesson.queueItems.length < 1) {
            return null;
        }

        const btnClass = this.props.selected ? "btn-secondary" : "btn-info";
        const actionInfo = this.props.selected ? "End lesson": "Start lesson";
        return React.createElement(
            "button",
            {
                "type": "button",
                "className": "btn " + btnClass + " btn-sm ml-2",
                "onClick": this.toggleLesson.bind(this)
            },
            actionInfo
        );
    }

    editQueue() {
        this.props.setActivity("editQueue", null, this.props.lesson.id);
    }

    editQueueButton() {
        if (!this.props.lesson.queueItems.length) {
            return null;
        }

        return React.createElement(
            "div",
            {
                "className": "btn btn-sm btn-primary ml-2",
                "onClick": this.editQueue.bind(this)
            },
            "Edit queue"
        );
    }

    queueDiv() {
        return React.createElement(
            "div",
            {},
            util.howManyExercises(this.props.lesson.queueItems),
            this.editQueueButton(),
            this.doQueueButton()
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            this.itemSubtitle(),
            this.notesDiv(),
            this.tagsDiv(),
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
            this.linkDiv(),
            this.queueDiv()
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "card border-secondary bg-light mb-3"},
            this.cardBody()
        );
    }

}