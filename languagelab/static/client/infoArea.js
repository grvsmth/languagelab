/**
 * Sticky top div for information about the status of the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*
*/
import commonElements from "./cards/commonElements.js";

/** Sticky top div for information about the status of the LanguageLab client */
export default class InfoArea {

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
     * A dismiss button for the alert or queue
     *
     * @param {string} id - the ID of the alert (or "queue") for the handler
     * @param {string} text - text to display with the button
     *
     * @return {object}
     */
    dismissButton(id, text=null) {
        const element = document.createElement("button");
        element.classList.add("btn-close");
            element.dataset.bsDismiss = "alert";

        element.setAttribute("aria-label", "close");
        element.type = "button";

        element.addEventListener(
            "click", this.dismissHandler.bind(this, id)
        );

        return element;
    }

    /**
     * The title of the alert
     *
     * @param {object} alert
     *
     * @return {object}
     */
    alertTitle(alert) {
        const element = document.createElement("strong");
        element.classList.add("me-1");

        element.append(alert.title);

        return element;
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
        const element = document.createElement("div");
        element.classList.add("alert", "alert-dismissible", statusClass);
        element.role = "alert";
        element.id = "alert_" + alert.id;

        element.append(
            this.alertTitle(alert),
            alert.message,
            this.dismissButton(alert.id)
        );

        return element;
    }

    /**
     * Generate an element for each alert in the props
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
        const element = document.createElement("h5");
        element.classList.add("card-title");

        element.append(this.props.lesson.name);

        return element;
    }

    /**
     * Information about the lesson, along with a close button
     *
     * @return {object}
     */
    lessonQueueBody() {
        const element = document.createElement("div");
        element.classList.add("card-body");

        const dismissButton = this.dismissButton("queue", "Close queue");
        dismissButton.dataset.bsDismiss = "queue";
        dismissButton.classList.add(
            "position-absolute", "top-0", "end-0", "m-2"
        );

        element.append(
            this.itemTitle(),
            commonElements.lessonSubtitle(this.props.lesson),
            dismissButton
        );

        return element;
    }

    /**
     * A lesson queue header card
     *
     * @return {object}
     */
    lessonQueueHeader() {
        let element = "";

        if (this.props.selectedType === "lessons"
            && this.props.activity === "editQueue"
        ) {
            element = document.createElement("div");
            element.role = "queue";
            element.classList.add("card", "bg-light", "border-secondary");
            element.append(this.lessonQueueBody());
        }

        return element;
    }

    /**
     * The info area body
     *
     * @return {object}
     */
    body() {
        const element = document.createElement("div");

        element.classList.add("sticky-top");
        element.append(...this.alertSeries(), this.lessonQueueHeader());

        return element;
    }

    /**
     * A link to the list of ISO 639 language names
     *
     * @return {object}
     */
    iso639a() {
        const element = document.createElement("a");
        element.href = this.props.iso639.url;
        element.target = "_blank";
        element.innerText = "list of ISO-639-3 language names and codes";

        return element;
    }

    /**
     * A sticky top div with the ISO 639 link
     *
     * @return {object}
     */
    languageInfo() {
        const element = document.createElement("div");
        element.classList.add("sticky-top", "mb-3");
        element.append("You may find this ", this.iso639a(), " useful.");

        return element;
    }

    /**
     * Return the main info area, if we've got alerts or if we're editing the
     * lesson queue.  If we're editing a language entry, show the ISO 639 div
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        if (this.props.alerts.length || this.props.activity === "editQueue") {
            return this.body();
        }

        if (this.props.selectedType === "languages") {
            return this.languageInfo();
        }

        return "";
    }
}
