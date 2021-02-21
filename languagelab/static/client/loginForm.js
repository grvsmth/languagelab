/*

    global React, PropTypes

*/
export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
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

    render() {
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
}

LoginForm.propTypes = {
    "loginClick": PropTypes.func.isRequired
};
