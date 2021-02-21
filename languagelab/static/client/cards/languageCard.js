/*

    global React, PropTypes

*/
export default class LanguageCard extends React.Component {
    constructor(props) {
        super(props);
    }

    cardTitle() {
        return React.createElement(
            "h5",
            {"className": "card-title"},
            this.props.language.name
        );
    }

    cardText() {
        return React.createElement(
            "span",
            {"className": "card-text mr-3"},
            this.props.language.code
        );
    }

    editClick() {
        this.props.selectItem(this.props.language.id, "edit");
    }

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

    textRow() {
        return React.createElement(
            "p",
            {},
            this.cardText(),
            this.editButton()
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.cardTitle(),
            this.textRow()
        );
    }

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
