export default class InfoArea extends React.Component {

    componentDidMount() {

    }

    dismissHandler(id) {
        this.props.dismissAlert(id);
    }

    hiddenX(id) {
        return React.createElement(
            "span",
            {
                "aria-hidden": "true",
                "onClick": this.dismissHandler.bind(this, id)
            },
            "×"
        );
    }

    dismissButton(id) {
        return React.createElement(
            "button",
            {
                "className": "close",
                "type": "button",
                "aria-label": "Close"
            },
            this.hiddenX(id)
        );
    }

    alertDiv(alert) {
        return React.createElement(
            "div",
            {
                "className": "alert alert-primary alert-dismissible",
                "role": "alert",
                "key": alert.id,
                "id": "alert_" + alert.id
            },
            alert.message,
            this.dismissButton(alert.id)
        );
    }

    alertSeries() {
        return this.props.alerts.map(this.alertDiv.bind(this));
    }

    lessonQueueHeader() {
        return React.createElement(
            "div",
            {
                "className": ""
            },
            JSON.stringify(this.props.lesson)
        );
    }

    render() {
        if (this.props.alerts.length) {
            return this.alertSeries();
        }

        if (this.props.selectedType === "lessons"
            && this.props.activity === "queueEdit"
        ) {
            return this.lessonQueueHeader();
        }
        return null;
    }

};