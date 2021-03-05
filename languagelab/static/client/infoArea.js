/**
 * Sticky top div for information about the status of the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

    global React, PropTypes

*/
import commonElements from "./cards/commonElements.js";

/** Sticky top div for information about the status of the LanguageLab client */
export default class InfoArea extends React.Component {

    /**
     * Handle a click on the close button for an alert OR the lesson queue
     *
     * @param {string} id - the ID of the alert or queue
     */
    dismissHandler(id) {
        if (id === "queue") {
            this.props.setActivity("read");
        }
        this.props.dismissAlert(id);
    }

    /**
     * A span to make the Bootstrap dismiss icon look nice
     *
     * @param {string} id - the ID of the alert (or "queue") for the handler
     * @param {string} text - text to display with the button
     *
     * @return {object}
     */
    dismissSpan(id, text=null) {
        return React.createElement(
            "span",
            {
                "onClick": this.dismissHandler.bind(this, id)
            },
            "×",
            text
        );
    }

    /**
     * A dismiss button for the alert or queue
     *
     * @param {string} id - the ID of the alert (or "queue") for the handler
     * @param {string} text - text to display with the button
     *
     * @return {object}
     */
    dismissButton(id, text=null) {
        return React.createElement(
            "button",
            {
                "className": "close",
                "type": "button",
            },
            this.dismissSpan(id, text)
        );
    }

    /**
     * The title of the alert
     *
     * @param {object} alert
     *
     * @return {object}
     */
    alertTitle(alert) {
        return React.createElement(
            "strong",
            {"className": "mr-1"},
            alert.title
        );
    }

    /**
     * An alert div with title, message and dismiss button
     *
     * @param {object} alert
     *
     * @return {object}
     */
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
            this.alertTitle(alert),
            alert.message,
            this.dismissButton(alert.id)
        );
    }

    /**
     * Generate a React element for each alert in the props
     *
     * @return {array}
     */
    alertSeries() {
        return this.props.alerts.map(this.alertDiv.bind(this));
    }

    /**
     * If we're editing a lesson queue, show a title with the lesson name
     *
     * @return {object}
     */
    itemTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.lesson.name
        );
    }

    /**
     * Information about the lesson, along with a close button
     *
     * @return {object}
     */
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

    iso639a() {
        return React.createElement(
            "a",
            {
                "href": this.props.iso639.url,
                "target": "_blank"
            },
            "list of ISO-639-3 language names and codes"
        );
    }

    languageInfo() {
        return React.createElement(
            "div",
            {"className": "sticky-top mb-3"},
            "You may find this ",
            this.iso639a(),
            " useful."
        );
    }

    render() {
        if (this.props.alerts.length || this.props.activity === "editQueue") {
            return this.body();
        }
        if (this.props.selectedType === "languages") {
            return this.languageInfo();
        }
        return null;
    }
}

InfoArea.propTypes = {
    "activity": PropTypes.string.isRequired,
    "alerts": PropTypes.array.isRequired,
    "dismissAlert": PropTypes.func.isRequired,
    "iso639": PropTypes.object.isRequired,
    "lesson": PropTypes.object,
    "selectedType": PropTypes.string.isRequired,
    "setActivity": PropTypes.func.isRequired
};
