export default class InfoArea extends React.Component {

    alertDiv(alert, index) {
        const alertId = "alert_" + index;

        return React.createElement(
            "div",
            {
                "className": "alert alert-primary alert-dismissible",
                "role": "alert",
                "key": alertId,
                "id": alertId
            },
            alert.message
        );
    }

    alertSeries() {
        console.log(this.props.alerts);
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