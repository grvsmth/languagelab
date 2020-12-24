import commonElements from "./commonElements.js";

export default class InfoArea extends React.Component {

    componentDidMount() {

    }

    dismissHandler(id) {
        if (id === "queue") {
            this.props.setActivity("read");
        }
        this.props.dismissAlert(id);
    }

    hiddenX(id, text=null) {
        return React.createElement(
            "span",
            {
                "aria-hidden": "true",
                "onClick": this.dismissHandler.bind(this, id)
            },
            "×",
            text
        );
    }

    dismissButton(id, text=null) {
        return React.createElement(
            "button",
            {
                "className": "close",
                "type": "button",
            },
            this.hiddenX(id, text)
        );
    }

    alertDiv(alert) {
        const statusClass = "alert-" + alert.status;
        return React.createElement(
            "div",
            {
                "className": "alert alert-dismissible " + statusClass,
                "role": "alert",
                "key": alert.id,
                "id": "alert_" + alert.id
            },
            alert.message,
            this.dismissButton(alert.id)
        );
    }

    alertSeries() {
        console.log("alertSeries", this.props.alerts);
        return this.props.alerts.map(this.alertDiv.bind(this));
    }

    itemTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.lesson.name
        );
    }

    lessonQueueBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.itemTitle(),
            commonElements.lessonSubtitle(this.props.lesson),
            this.dismissButton("queue", "Close queue")
        );
    }

    lessonQueueHeader() {
        console.log("lessonQueueHeader");
        if (this.props.selectedType === "lessons"
            && this.props.activity === "editQueue"
        ) {
            return React.createElement(
                "div",
                {
                    "className": "card bg-light border-secondary"
                },
                this.lessonQueueBody()
            );
        }
        return null;
    }

    body() {
        return React.createElement(
            "div",
            {"className": "sticky-top"},
            this.alertSeries(),
            this.lessonQueueHeader()
        );
    }

    render() {
        console.log(this.props);
        if (this.props.alerts.length || this.props.activity === "editQueue") {
            return this.body();
        }
        return null;
    }

};