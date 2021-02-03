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

    dialog() {
        return React.createElement(
            "div",
            {"className": "modal-dialog"},
            this.spinner()
        );
    }

    render() {
        if (!this.loading()) {
            console.log("finished loading");
            return null;
        }

        return React.createElement(
            "div",
            {
                "aria-hidden": false,
                "className": "modal show",
                "data-show": true,
                "ref": this.modal,
                "style": {"display": "block"},
                "tabIndex": "-1"
            },
            this.dialog()
        );
    }

}