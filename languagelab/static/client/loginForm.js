/**
 * Generate a login form for the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

import HelpCard from "./cards/helpCard.js";

/** The login form class */
export default class LoginForm {

    /**
     * Display the title for the login card
     *
     * @return {object}
     */
    cardTitle() {
        const element = document.createElement("h3");
        element.classList.add("card-title");
        element.innerText = "Login";

        return element;
    }

    /**
     * Generate an automatic HTML label for the field
     *
     * @param {string} fieldName - the name of the field
     *
     * @return {object}
     */
    formLabel(fieldName) {
        const element = document.createElement("label");
        element.for = fieldName;
        element.innerText = fieldName + ": ";

        return element;
    }

    /**
     * An input element, with optional autofocus
     *
     * @param {string} fieldName - the name of the field
     * @param {boolean} autofocus - whether or not to set autofocus here
     *
     * @return {object}
     */
    formInput(fieldName, autofocus=false) {
        const element = document.createElement("input");
        element.autofocus = autofocus;
        element.classList.add("form-control");
        element.id = fieldName;
        element.name = fieldName;
        element.type = "text";

        return element;
    }

    /**
     * A form group for the login username
     *
     * @return {object}
     */
    usernameGroup() {
        const element = document.createElement("div");
        element.classList.add("form-group");

        element.append(
            this.formLabel("username"),
            this.formInput("username", true)
        );

        return element;
    }

    /**
     * A password input element
     *
     * @return {object}
     */
    passwordInput() {
        const element = document.createElement("input");
        element.classList.add("form-control");
        element.id = "password";
        element.name = "password";
        element.type = "password";

        return element;
    }

    /**
     * A form group for the login username
     *
     * @return {object}
     */
    passwordGroup() {
        const element = document.createElement("div");
        element.classList.add("form-group");

        element.append(
            this.formLabel("password"),
            this.passwordInput()
        );
        return element;
    }

    /**
     * The login submit button
     *
     * @return {object}
     */
    submitButton() {
        const element = document.createElement("button");
        element.classList.add("btn", "btn-success");
        element.type = "submit";
        element.innerText = "Log in";

        return element;
    }

    /**
     * The main login form
     *
     * @return {object}
     */
    loginForm() {
        const element = document.createElement("form");
        element.name = "loginForm";
        element.addEventListener("submit", this.props.loginClick);

        element.append(
            this.usernameGroup(),
            this.passwordGroup(),
            this.submitButton()
        );

        return element;
    }

    /**
     * A card-body div for the login form and title
     *
     * @return {object}
     */
    cardBody() {
        const element = document.createElement("div");
        element.classList.add("card-body");

        element.append(
            this.cardTitle(),
            this.loginForm()
        );
        return element;
    }

    /**
     * Wrap the login form in a card element to fit with the info cards
     *
     * @return {object}
     */
    loginCard() {
        const col = document.createElement("col");
        const element = document.createElement("div");
        element.classList.add("card");
        element.append(this.cardBody());

        col.append(element);
        return col;
    }

    /**
     * Generate a help card based on a given item in help.js
     *
     * @param {string} key - the key of the item
     *
     * @return {object}
     */
    helpCard(key) {
        const element = new HelpCard();
        return element.render({
            "key": key,
            "helpItem": this.props.help[key]
        });
    }

    /**
     * The React render method
     *
     * @return {object}
     */
    render(props) {
        this.props = props;

        const element = document.createElement("div");
        element.classList.add("row", "row-cols-1", "row-cols-md-3", "g-4");

        element.append(
            this.loginCard(),
            this.helpCard("about"),
            this.helpCard("source")
        );

        return element;
    }
}
