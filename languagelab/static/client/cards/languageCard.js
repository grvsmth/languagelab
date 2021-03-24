/**
 * Card for displaying info about a language in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global React, PropTypes

*/

/** Card for displaying info about a language in the LanguageLab client */
export default class LanguageCard extends React.Component {

    /**
     * A title element with the language name from the props
     *
     * @return {object}
     */
    cardTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.language.name
        );
    }

    /**
     * A text element with the language code from the props
     *
     * @return {object}
     */
    cardText() {
        return React.createElement(
            "span",
            {"className": "card-text mr-3"},
            this.props.language.code
        );
    }

    /**
     * Handle clicks on the edit button by calling the selectItem() function
     * from the props with the ID of the language
     */
    editClick() {
        this.props.selectItem(this.props.language.id, "edit");
    }

    /**
     * An edit button
     *
     * @return {object}
     */
    editButton() {
        return React.createElement(
            "button",
            {
                "className": "btn btn-sm btn-primary",
                "onClick": this.editClick.bind(this),
                "type": "button"
            },
            "Edit"
        );
    }

    /**
     * A paragraph with the text and the edit button
     *
     * @return {object}
     */
    textRow() {
        return React.createElement(
            "p",
            {},
            this.cardText(),
            this.editButton()
        );
    }

    /**
     * The card body with the title and text row
     *
     * @return {object}
     */
    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.cardTitle(),
            this.textRow()
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
            {"className": "card border-success bg-light"},
            this.cardBody()
        );
    }

}

LanguageCard.propTypes = {
    "language": PropTypes.object.isRequired,
    "selectItem": PropTypes.func.isRequired
};
