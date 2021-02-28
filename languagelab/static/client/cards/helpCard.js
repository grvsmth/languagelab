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

    /**
     * Return an element with title styling and the title prop
     *
     * @return {object}
     */
    cardTitle() {
        return React.createElement(
            "h3",
            {
                "className": "card-title"
            },
            this.props.helpItem.title
        );
    }

    /**
     * An element with text styling on the description prop
     *
     * @return {object}
     */
    cardText() {
        return React.createElement(
            "p",
            {
                "className": "card-text"
            },
            this.props.helpItem.description
        );
    }

    /**
     * If there's an "a" prop, return an a element with the properties of that
     * "a" prop
     *
     * @return {object}
     */
    cardLink() {
        if (!Object.hasOwnProperty.call(this.props.helpItem, "a")) {
            return null;
        }


        return React.createElement(
            "a",
            {
                "className": "card-link",
                "href": this.props.helpItem.a.href,
                "target": this.props.helpItem.a.target
            },
            this.props.helpItem.a.html
        );
    }

    /**
     * A card body containing title, text and optional link
     *
     *
     * @return {object}
     */
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

    /**
     * The React render() method
     *
     * @return {object}
     */
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
