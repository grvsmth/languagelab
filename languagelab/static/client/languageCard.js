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
            "p",
            {"className": "card-text"},
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

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.cardTitle(),
            this.cardText(),
            this.editButton()
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