/**
 * Bootstrap card component for linking to control features like user
 * administration and data export
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/** Card for linking to control features */
export default class ControlCard {
    /**
     * Card title with the title prop
     *
     * @return {object}
     */
    cardTitle() {
        const element = document.createElement("h3");
        element.classList.add("card-title");

        element.innerText = this.props.control.title;

        return element;
    }

    /**
     * Card text with the description prop
     *
     * @return {object}
     */
    cardText() {
        const element = document.createElement("p");
        element.classList.add("card-text");
        element.innerText = this.props.control.description;

        return element;
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
        const element = document.createElement("a");
        element.classList.add("card-link");
        element.href = this.props.control.url;
        element.target = this.props.control.target;

        element.innerText = this.linkText();

        if (this.props.control.endpoint) {
            element.addEventListener("click", this.exportData.bind(this));
        }

        return element;
    }

    /**
     * A card body with title, description and link
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
     * A Bootstrap card
     *
     * @return {object}
     */
    render() {
        const element = document.createElement("div");
        element.classList.add("card");
        element.append(this.cardBody());

        return element;
    }
}
