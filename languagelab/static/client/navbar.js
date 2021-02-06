export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.navClick = this.navClick.bind(this);
    }

    navbarBrand() {
        var brandText = "LanguageLab";
        if (this.props.version) {
            brandText += " v. " + this.props.version;
        }
        return React.createElement(
            "a",
            {"className": "navbar-brand", "href": "#"},
            brandText
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

        if (this.props.navUrl.hasOwnProperty(model.endpoint)) {
            href = this.props.navUrl[model.endpoint];
            target = "_blank";
            onClick = null;
        }

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
        var className = "nav-item";
        if (this.props.activeItem === model.endpoint) {
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
            this.props.models.map(this.navItem.bind(this))
        );
    }

    welcomeItem(username) {
        if (!this.props.currentUser) {
            return null;
        }

        return React.createElement(
            "span",
            {
                "className": "nav-item"
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
                "className": "btn btn-secondary ml-1",
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
            this.welcomeItem(),
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
        return React.createElement(
            "nav",
            {
                "className": "navbar navbar-expand-sm navbar-light bg-light sticky-top"
            },
            this.navbarBrand(),
            this.toggler(),
            this.navContent()
        );
    }
}