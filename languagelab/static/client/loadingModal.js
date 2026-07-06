/**
 * Modal with spinner while data is loading in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

*/

/** Modal with spinner while data is loading in the LanguageLab client */
export default class LoadingModal {
    /**
     * Are we still loading this item type?  Return true even if undefined.
     * Also return true if lessons are loaded but exercises are not.  Return
     * false if the user hasn't logged in, or if the type is local.
     *
     * @return {boolean}
     */
    loading() {
        if (this.props.activity === "login") {
            return false;
        }

        if (this.props.localTypes.includes(this.props.itemType)) {
            return false;
        }

        if (this.props.itemType === "lessons"
            && this.props.loading["exercises"]
        ) {
            return true;
        }

        const loading = this.props.loading[this.props.itemType];
        return loading !== false;
    }

    /**
     * A text span for screen readers
     *
     * @return {object}
     */
    spinnerSr() {
        const element = document.createElement("span");
        element.classList.add("visually-hidden");
        element.id = "loadingLabel";
        element.innerText = "Loading...";

        return element;
    }

    /**
     * A border div to enclose the spinner
     *
     * @return {object}
     */
    spinner() {
        const element = document.createElement("div");
        element.classList.add("spinner-border", "text-success");
        element.role = "status";
        element.style.setProperty("height", "10rem");
        element.style.setProperty("width", "10rem");
        element.append(this.spinnerSr());

        return element;
    }

    /**
     * A modal body to enclose the spinner border
     *
     * @return {object}
     */
    body() {
        const element = document.createElement("div");
        element.classList.add("modal-body", "mx-auto");
        element.append(this.spinner());

        return element;
    }

    /**
     * A modal content div to enclose the modal body
     *
     * @return {object}
     */
    content() {
        const element = document.createElement("div");
        element.classList.add("modal-content");
        element.append(this.body());

        return element;
    }

    /**
     * A modal dialog div to enclose the modal content
     *
     * @return {object}
     */
    dialog() {
        const element = document.createElement("div");
        element.classList.add("modal-dialog", "modal-dialog-centered");
        element.append(this.content());

        return element;
    }

    /**
     * The static backdrop containing the modal dialog
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        if (!this.loading()) {
            return "";
        }

        const element = document.createElement("div");
        element.setAttribute("aria-hidden", true);
        element.setAttribute("aria-labelledby", "loadingLabel");
        element.classList.add("modal-fade");
        element.dataset.keyboard = "false";
        element.id = "loadingModal";
        element.style.setProperty("display", "block");
        element.tabIndex = -1;

        element.append(this.dialog());

        return element;
    }
}
