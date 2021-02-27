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

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    }

    cardTitle() {
        return React.createElement(
            "h3",
            {
                "className": "card-title"
            },
            "Login"
        );
    }

    formLabel(fieldName) {
        return React.createElement(
            "label",
            {"htmlFor": fieldName},
            fieldName + ": "
        );
    }

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

    usernameGroup() {
        return React.createElement(
            "div",
            {"className": "form-group"},
            this.formLabel("username"),
            this.formInput("username", true)
        );
    }

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

    passwordGroup() {
        return React.createElement(
            "div",
            {"className": "form-group"},
            this.formLabel("password"),
            this.passwordInput()
        )
    }

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

    loginCard() {
        return React.createElement(
            "div",
            {
                "className": "card"
            },
            this.cardBody()
        );
    }

    helpCard(key) {
        console.log(`helpCard(${key})`, help[key]);
        return React.createElement(
            HelpCard,
            {
                "key": key,
                "helpItem": help[key]
            },
            null
        );
    }

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
