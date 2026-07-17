/**
 * Card for displaying info about a language in the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/** Card for displaying info about a language in the LanguageLab client */
export default class LanguageCard {
    /**
     * A title element with the language name from the props
     *
     * @return {object}
     */
    cardTitle() {
        const element = document.createElement("h5");
        element.classList.add("card-title");
        element.innerText = this.props.language.name;

        return element;
    }

    /**
     * A text element with the language code from the props
     *
     * @return {object}
     */
    cardText() {
        const element = document.createElement("span");
        element.classList.add("card-text", "me-3");
        element.innerText = this.props.language.code;

        return element;
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
        const element = document.createElement("button");
        element.classList.add("btn", "btn-sm", "btn-primary");
        element.addEventListener("click", this.editClick.bind(this));
        element.type = "button";
        element.innerText = "Edit";

        return element;
    }

    /**
     * A paragraph with the text and the edit button
     *
     * @return {object}
     */
    textRow() {
        const element = document.createElement("p");
        element.append(this.cardText(), this.editButton());

        return element;
    }

    /**
     * The card body with the title and text row
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("div");
        element.classList.add("card-body");
        element.append(
            this.cardTitle(),
            this.textRow()
        );

        return element;
    }

    /**
     * The render() method
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        const col = document.createElement("div");
        col.classList.add("col");

        const element = document.createElement("div");
        element.classList.add("card", "border-success", "bg-light");
        element.append(this.cardBody());

        col.append(element);
        return col;
    }

}
