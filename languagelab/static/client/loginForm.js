/**
 * Generate a login form for the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

    global React, PropTypes

*/
import help from "./help.js";
import HelpCard from "./cards/helpCard.js";

/** The login form class. @extends React.Component */
export default class LoginForm extends React.Component {

    /** Display the title for the login card */
    cardTitle() {
        return React.createElement(
            "h3",
            {
                "className": "card-title"
            },
            "Login"
        );
    }

    /**
     * Generate an automatic HTML label for the field
     *
     * @param {string} fieldName - the name of the field
     */
    formLabel(fieldName) {
        return React.createElement(
            "label",
            {"htmlFor": fieldName},
            fieldName + ": "
        );
    }

    /**
     * An input element, with optional autofocus
     *
     * @param {string} fieldName - the name of the field
     * @param {boolean} autofocus - whether or not to set autofocus here
     */
    formInput(fieldName, autofocus=false) {
        return React.createElement(
            "input",
            {
                "autoFocus": autofocus,
                "className": "form-control",
                "id": fieldName,
                "name": fieldName,
                "type": "text"
            },
            null
        );
    }

    /** A form group for the login username */
    usernameGroup() {
        return React.createElement(
            "div",
            {"className": "form-group"},
            this.formLabel("username"),
            this.formInput("username", true)
        );
    }

    /** A password input element */
    passwordInput() {
        return React.createElement(
            "input",
            {
                "className": "form-control",
                "id": "password",
                "name": "password",
                "type": "password"
            },
            null
        );
    }

    /** A form group for the login username */
    passwordGroup() {
        return React.createElement(
            "div",
            {"className": "form-group"},
            this.formLabel("password"),
            this.passwordInput()
        )
    }

    /** The login submit button */
    submitButton() {
        return React.createElement(
            "button",
            {
                "className": "btn btn-success",
                "type": "submit"
            },
            "Log in"
        );
    }

    /** The main login form */
    loginForm() {
        return React.createElement(
            "form",
            {
                "name": "loginForm",
                "onSubmit": this.props.loginClick
            },
            this.usernameGroup(),
            this.passwordGroup(),
            this.submitButton()
        )
    }

    /** A card-body div for the login form and title */
    cardBody() {
        return React.createElement(
            "div",
            {
                "className": "card-body"
            },
            this.cardTitle(),
            this.loginForm()
        );
    }

    /** Wrap the login form in a card element to fit with the info cards */
    loginCard() {
        return React.createElement(
            "div",
            {
                "className": "card"
            },
            this.cardBody()
        );
    }

    /** Generate a help card based on a given item in help.js */
    helpCard(key) {
        return React.createElement(
            HelpCard,
            {
                "key": key,
                "helpItem": help[key]
            },
            null
        );
    }

    /** The React render method */
    render() {
        return React.createElement(
            "div",
            {"className": "card-columns"},
            this.loginCard(),
            this.helpCard("about"),
            this.helpCard("source"),
        );
    }
}

LoginForm.propTypes = {
    "loginClick": PropTypes.func.isRequired
};
