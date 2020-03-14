/*

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

    formInput(fieldName) {
        return React.createElement(
            "input",
            {
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
            this.formInput("username")
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
                "onClick": this.props.loginClick,
                "type": "button"
            },
            "Log in"
        );
    }

    render() {

        return React.createElement(
            "form",
            {"name": "loginForm"},
            this.usernameGroup(),
            this.passwordGroup(),
            this.submitButton()
        )
    }
}
