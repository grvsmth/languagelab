export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.navClick = this.navClick.bind(this);
    }

    navbarBrand() {
        return React.createElement(
            "a",
            {"className": "navbar-brand", "href": "#"},
            "LanguageLab"
        );
    }

    navClick(event) {
        event.preventDefault();
        this.props.navClick(event.target.id);
    }

    srOnlySpan(key) {
        if (this.props.selectedType !== key) {
            return null;
        }
        return React.createElement(
            "span",
            {"className": "sr-only"},
            "(current)"
        );
    }

    navLink(key) {
        return React.createElement(
            "a",
            {
                "className": "nav-link",
                "href": "#",
                "id": this.props.itemType[key],
                "onClick": this.navClick
            },
            key,
            this.srOnlySpan(key)
        );
    }

    navItem(key) {
        var className = "nav-item";
        if (this.props.selectedType === key) {
            className = "nav-item active";
        }

        return React.createElement(
            "li",
            {
                "className": className,
                "key": key
            },
            this.navLink(key)
        )
    }

    navUl() {
        if (!this.props.currentUser) {
            return null;
        }

        return React.createElement(
            "ul",
            {"className": "navbar-nav mr-auto"},
            Object.keys(this.props.itemType)
                .map(this.navItem.bind(this))
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