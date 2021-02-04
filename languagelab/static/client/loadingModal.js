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
            {"className": "modal-body"},
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
            {"className": "modal-dialog modal-dialog-centered modal-xl"},
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
                "className": "modal show",
                "data-show": true,
                "data-backdrop": "static",
                "ref": this.modal,
                "style": {"display": "block"},
                "tabIndex": "-1",
                "onClick": this.doNothing
            },
            this.dialog()
        );
    }

}