/**
 * Bootstrap card for help documentation for the LanguageLab app
 *
 * Angus B. Grieve-Smith, 2026
 *
 */

export default class HelpCard {

    /**
     * Return an element with title styling and the title prop
     *
     * @return {object}
     */
    cardTitle() {
        const element = document.createElement("h3");
        element.classList.add("card-title");
        element.innerText = this.props.helpItem.title;

        return element;
    }

    /**
     * An element with text styling on the description prop
     *
     * @return {object}
     */
    cardText() {
        const element = document.createElement("p");
        element.classList.add("card-text");
        element.innerText = this.props.helpItem.description;

        return element;
    }

    /**
     * If there's an "a" prop, return an a element with the properties of that
     * "a" prop
     *
     * @return {object}
     */
    cardLink() {
        if ("a" in this.props.helpItem) {
            return "";
        }


        const element = document.createElement("a");
        element.classList.add("card-link");
        element.href = this.props.helpItem.a.href;
        element.target = this.props.helpItem.a.target;
        element.innerText = this.props.helpItem.a.html;

        return element;
    }

    /**
     * A card body containing title, text and optional link
     *
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("div");
        element.classList.add("card-body");

        element.append(
            this.cardTitle(),
            this.cardText(),
            this.cardLink()
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

        const col = document.createElement("col");
        const element = document.createElement("div");
        element.classList.add("card");
        element.append(this.cardBody());

        col.append(element);
        return col;
    }
}
