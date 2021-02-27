/**
 * Bootstrap card for help documentation for the LanguageLab app
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, PropTypes

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

    cardLink() {
        if (!Object.hasOwnProperty.call(this.props.helpItem, "a")) {
            return null;
        }

        const options = {
            "className": "card-link",
            "href": this.props.helpItem.a.href,
            "target": this.props.helpItem.a.target
        };

        return React.createElement(
            "a",
            options,
            this.props.helpItem.a.html
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {
                "className": "card-body"
            },
            this.cardTitle(),
            this.cardText(),
            this.cardLink()
        );
    }

    /** The React render method */
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

HelpCard.propTypes = {
    "helpItem": PropTypes.object.isRequired,
    "helpItem.title": PropTypes.string.isRequired,
    "helpItem.description": PropTypes.string.isRequired
};
