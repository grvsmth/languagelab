/*

    global React, PropTypes

*/
export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.navClick = this.navClick.bind(this);
    }

    navbarBrand() {
        var brandText = "LanguageLab";
        return React.createElement(
            "a",
            {
                "className": "navbar-brand",
                "href": "#"
            },
            brandText
        );
    }

    versionText() {
        if (!this.props.version) {
            return null;
        }

        return React.createElement(
            "li",
            {"className": "navbar-text mr-2"},
            "v. " + this.props.version
        );
    }

    navClick(event) {
        event.preventDefault();
        this.props.navClick(event.target.id);
    }

    srOnlySpan(model) {
        if (this.props.selectedType !== model.endpoint) {
            return null;
        }
        return React.createElement(
            "span",
            {"className": "sr-only"},
            "(current)"
        );
    }

    navLink(model) {
        var href = "#";
        var target = "_self";
        var onClick = this.navClick;

        return React.createElement(
            "a",
            {
                "className": "nav-link",
                "href": href,
                "target": target,
                "id": model.endpoint,
                "onClick": onClick
            },
            model.menu,
            this.srOnlySpan(model)
        );
    }

    navItem(model) {
        if (model.hideNav) {
            return null;
        }

        var className = "nav-item";
        if (this.props.selectedType === model.endpoint) {
            className = "nav-item active";
        }

        return React.createElement(
            "li",
            {
                "className": className,
                "key": model.endpoint
            },
            this.navLink(model)
        )
    }

    navUl() {
        if (!this.props.currentUser) {
            return null;
        }

        return React.createElement(
            "ul",
            {"className": "navbar-nav mr-auto"},
            this.versionText(),
            this.welcomeItem(),
            this.props.models.map(this.navItem.bind(this))
        );
    }

    welcomeItem() {
        if (!this.props.currentUser) {
            return null;
        }

        return React.createElement(
            "li",
            {
                "className": "navbar-text text-success"
            },
            `Welcome ${this.props.currentUser.username}!`
        )
    }

    logoutButton() {
        if (!this.props.currentUser) {
            return null;
        }

        return React.createElement(
            "button",
            {
                "className": "btn btn-secondary",
                "onClick": this.props.logout
            },
            "Logout"
        )
    }

    navContent() {
        return React.createElement(
            "div",
            {
                "className": "collapse navbar-collapse",
                "id": "navContent"
            },
            this.navUl(),
            this.logoutButton()
        );
    }

    togglerIcon() {
        return React.createElement(
            "span",
            {"className": "navbar-toggler-icon"},
            null
        );
    }

    toggler() {
        return React.createElement(
            "button",
            {
                "className": "navbar-toggler",
                "type": "button",
                "data-toggle": "collapse",
                "data-target": "#navContent",
                "aria-controls": "navContent",
                "aria-expanded": false,
                "aria-label": "Toggle navigation"
            },
            this.togglerIcon()
        )
    }

    render() {
        const className = [
            "navbar",
            "navbar-expand-md",
            "navbar-light",
            "bg-light",
            "sticky-top"
        ].join(" ");

        return React.createElement(
            "nav",
            {
                "className": className
            },
            this.navbarBrand(),
            this.toggler(),
            this.navContent()
        );
    }
}

Navbar.propTypes = {
    "currentUser": PropTypes.object.isRequired,
    "logout": PropTypes.func.isRequired,
    "models": PropTypes.object.isRequired,
    "navClick": PropTypes.func.isRequired,
    "selectedType": PropTypes.string.isRequired,
    "version": PropTypes.string.isRequired
};