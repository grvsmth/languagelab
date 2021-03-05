/**
 * Modal with spinner while data is loading in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

    global React, PropTypes

*/
export default class LoadingModal extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    loading() {
        return this.props.loading[this.props.itemType];
    }

    spinnerSr() {
        return React.createElement(
            "span",
            {"className": "sr-only"},
            "Loading..."
        );
    }

    spinner() {
        return React.createElement(
            "div",
            {
                "className": "spinner-border text-success",
                "role": "status"
            },
            this.spinnerSr()
        );
    }

    body() {
        return React.createElement(
            "div",
            {"className": "modal-body mx-auto"},
            this.spinner()
        );
    }

    content() {
        return React.createElement(
            "div",
            {"className": "modal-content"},
            this.body()
        );
    }

    dialog() {
        return React.createElement(
            "div",
            {"className": "modal-dialog modal-dialog-centered"},
            this.content()
        );
    }

    doNothing(event) {
        event.preventDefault();
    }

    render() {
        if (!this.loading()) {
            return null;
        }

        return React.createElement(
            "div",
            {
                "aria-hidden": false,
                "className": "modal",
                "style": {"display": "block"},
                "tabIndex": "-1",
                "onClick": this.doNothing
            },
            this.dialog()
        );
    }
}

LoadingModal.propTypes = {
    "itemType": PropTypes.string.isRequired,
    "loading": PropTypes.object.isRequired
};