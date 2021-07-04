/**
 * Navigation bar for the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2021
 */

/*

    global React, PropTypes

*/

/** Navigation bar for the LanguageLab client */
export default class Navbar extends React.Component {

    /**
     * A link with the navbar brand (i.e. the name)
     *
     * @return {object}
     */
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

    /**
     * Display the version from the config file
     *
     * @return {object}
     */
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

    /**
     * Click handler for the nav buttons
     *
     * @param {object} event
     *
     * @return {object}
     */
    navClick(event) {
        event.preventDefault();
        this.props.navClick(event.target.id);
    }

    /**
     * Tell screen readers which button corresponds to the current view, since
     * otherwise it's only visible via whatever formatting Bootstrap puts on its
     * active class
     *
     * @param {string} model
     *
     * @return {object}
     */
    srOnlySpan(endpoint) {
        if (this.props.selectedType !== endpoint) {
            return null;
        }
        return React.createElement(
            "span",
            {"className": "sr-only"},
            "(current)"
        );
    }

    /**
     * Create a link for the model, with ID, screenreader only span and click
     * handler
     *
     * @param {object} model
     *
     * @return {object}
     */
    navLink(model) {
        return React.createElement(
            "a",
            {
                "className": "nav-link",
                "href": "#",
                "target": "_self",
                "id": model.endpoint,
                "onClick": this.navClick.bind(this)
            },
            model.menu,
            this.srOnlySpan(model.endpoint)
        );
    }

    /**
     * Nav item with active class if this is the selected type
     *
     * @param {object} model
     *
     * @return {object}
     */
    navItem(model) {
        if (model.hideNav) {
            return null;
        }

        if (!model.nonStaff && this.props.config.staffCanWrite) {
            if (!this.props.currentUser.is_staff) {
                return null;
            }
        }

        const activeClass = this.props.selectedType === model.endpoint
            ? " active": "";

        return React.createElement(
            "li",
            {
                "className": "nav-item" + activeClass,
                "key": model.endpoint
            },
            this.navLink(model)
        )
    }

    /**
     * A navbar text item welcoming the user
     *
     * @return {object}
     */
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

    /**
     * Navbar nav with version text, welcome item and a nav-item for each model
     *
     * @return {object}
     */
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

    /**
     * Logout button!
     *
     * @return {object}
     */
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

    /**
     * Nav content, including the UL and the logout button
     *
     * @return {object}
     */
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

    /**
     * An icon for the toggler button
     *
     * @return {object}
     */
    togglerIcon() {
        return React.createElement(
            "span",
            {"className": "navbar-toggler-icon"},
            null
        );
    }

    /**
     * A button to open the menu when we're at narrow widths
     *
     * @return {object}
     */
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

    /**
     * The main nav, with brand, toggler and content
     *
     * @return {object}
     */
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