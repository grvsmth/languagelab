/*

*/
export default class HelpCard extends React.Component {

    cardTitle() {
        return React.createElement(
            "h3",
            {
                "className": "card-title"
            },
            this.props.helpItem.title
        );
    }

    cardText() {
        return React.createElement(
            "p",
            {
                "className": "card-text"
            },
            this.props.helpItem.description
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {
                "className": "card-body"
            },
            this.cardTitle(),
            this.cardText()
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