export default class MediaCard extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    inputChange(event) {
        console.dir(event);
    }

    itemLabel(fieldName, inputId) {
        return React.createElement(
            "label",
            {"htmlFor": inputId},
            fieldName
        );
    }

    textInput(fieldName, inputId) {
        return React.createElement(
            "input",
            {
                "id": inputId,
                "className": "form-control",
                "value": this.props.mediaItem[fieldName],
                "onChange": this.inputChange
            },
            null
        );
    }

    textInputDiv(fieldName) {
        const inputId = [fieldName, this.props.mediaItem.id].join("_");
        return React.createElement(
            "div",
            {"className": "col-sm"},
            this.itemLabel(fieldName, inputId),
            this.textInput(fieldName, inputId)
        );
    }

    firstRow() {
        return React.createElement(
            "div",
            {"className": "form-row"},
            this.textInputDiv("name")
        );
    }

    cardBody() {
        return React.createElement(
            "div",
            {"className": "card-body"},
            this.firstRow()
        );
    }

    render() {
        return React.createElement(
            "div",
            {"className": "card bg-light"},
            this.cardBody()
        );
    }

}