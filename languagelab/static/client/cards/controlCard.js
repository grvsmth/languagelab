export default class ControlCard extends React.Component {

    cardTitle() {
        return React.createElement(
            "h3",
            {
                "className": "card-title"
            },
            this.props.control.title
        );
    }

    cardText() {
        return React.createElement(
            "p",
            {
                "className": "card-text"
            },
            this.props.control.description
        );
    }

    linkText() {
        return "Open in a new tab";
    }

    exportData() {
        this.props.exportData(this.props.control);
    }

    cardLink() {
        const options = {
            "className": "card-link",
            "href": this.props.control.url,
            "target": this.props.control.target
        };

        if (this.props.control.endpoint) {
            options.onClick = this.exportData.bind(this);
        }

        return React.createElement(
            "a",
            options,
            this.linkText()
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {
                "className": "card-body"
            },
            this.cardTitle(),
            this.cardLink()
        );
    }

    render() {
        return React.createElement(
            "div",
            {
                "className": "card"
            },
            this.cardBody()
        );
    }
}