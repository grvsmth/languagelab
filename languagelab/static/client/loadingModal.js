/**
 * Modal with spinner while data is loading in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

    global React, PropTypes

*/

/** Modal with spinner while data is loading in the LanguageLab client */
export default class LoadingModal extends React.Component {

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
        return React.createElement(
            "span",
            {
                "className": "sr-only",
                "id": "loadingLabel"
            },
            "Loading..."
        );
    }

    /**
     * A border div to enclose the spinner
     *
     * @return {object}
     */
    spinner() {
        return React.createElement(
            "div",
            {
                "className": "spinner-border text-success",
                "role": "status",
                "style": {
                    "height": "10rem",
                    "width": "10rem"
                }
            },
            this.spinnerSr()
        );
    }

    /**
     * A modal body to enclose the spinner border
     *
     * @return {object}
     */
    body() {
        return React.createElement(
            "div",
            {"className": "modal-body mx-auto"},
            this.spinner()
        );
    }

    /**
     * A modal content div to enclose the modal body
     *
     * @return {object}
     */
    content() {
        return React.createElement(
            "div",
            {"className": "modal-content"},
            this.body()
        );
    }

    /**
     * A modal dialog div to enclose the modal content
     *
     * @return {object}
     */
    dialog() {
        return React.createElement(
            "div",
            {"className": "modal-dialog modal-dialog-centered"},
            this.content()
        );
    }

    /**
     * The static backdrop containing the modal dialog
     *
     * @return {object}
     */
    render() {
        if (!this.loading()) {
            return null;
        }

        return React.createElement(
            "div",
            {
                "aria-hidden": true,
                "aria-labelledby": "loadingLabel",
                "className": "modal",
                "data-keyboard": "false",
                "id": "loadingModal",
                "style": {"display": "block"},
                "tabIndex": "-1"
            },
            this.dialog()
        );
    }
}

LoadingModal.propTypes = {
    "activity": PropTypes.string.isRequired,
    "itemType": PropTypes.string.isRequired,
    "loading": PropTypes.object.isRequired,
    "localTypes": PropTypes.array.isRequired
};