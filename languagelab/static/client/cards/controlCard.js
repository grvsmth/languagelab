/**
 * Bootstrap card component for linking to control features like user
 * administration and data export
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, PropTypes

*/

/** Card for linking to control features */
export default class ControlCard extends React.Component {

    /**
     * Card title with the title prop
     *
     * @return {object}
     */
    cardTitle() {
        return React.createElement(
            "h3",
            {
                "className": "card-title"
            },
            this.props.control.title
        );
    }

    /**
     * Card text with the description prop
     *
     * @return {object}
     */
    cardText() {
        return React.createElement(
            "p",
            {
                "className": "card-text"
            },
            this.props.control.description
        );
    }

    /**
     * placeholder for internationalization or in case we want more specific
     * text on the links
     *
     * @return {string}
     */
    linkText() {
        return "Open in a new tab";
    }

    /**
     * Call the exportData function, passing in an object with the endpoint
     * and mimetype to export
     */
    exportData() {
        this.props.exportData(this.props.control);
    }

    /**
     * A link element with optional click handler
     *
     * @return {object}
     */
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

    /**
     * A card body with title, description and link
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
     * A Bootstrap card
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

ControlCard.propTypes = {
    "control": PropTypes.object.isRequired,
    "exportData": PropTypes.func.isRequired
};
