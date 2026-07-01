/**
 * Navigation bar for the LanguageLab client
 *
 * Angus B. Grieve-Smith, 2026
 */

/*


*/

/** Navigation bar for the LanguageLab client */
export default class Navbar {
    constructor(config) {
        console.log("config", config);
        this.config = config;
    }

    /**
     * A link with the navbar brand (i.e. the name)
     *
     * @return {object}
     */
    navbarBrand() {
        const brandElement = document.createElement("a");
        brandElement.classList.add("navbar-brand");
        brandElement.href = "#";
        brandElement.innerText = this.config.brandText;

        return brandElement;
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

        const element = document.createElement("li");
        element.classList.add("nav-item", "me-2");

        element.innerText = "v. " + this.props.version;

        return element;
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
        const element = document.createElement(
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
        const element = document.createElement(
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

        if (!model.nonStaff && this.props.staffCanWrite) {
            if (!this.props.currentUser.is_staff) {
                return null;
            }
        }

        const activeClass = this.props.selectedType === model.endpoint
            ? " active": "";

        const element = document.createElement(
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
            console.log("returning null");
            return null;
        }

        const element = document.createElement("li");
        element.classList.add("nav-item", "text-success");
        element.innerText = `Welcome ${this.props.currentUser.username}!`;

        return element;
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

        const element = document.createElement("ul");
        element.classList.add("navbar-nav", "me-auto");

        element.append(
            this.props.models.map(this.navItem.bind(this)),
            this.versionText(),
            this.welcomeItem()
        );

        return element;
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

        const element = document.createElement("button");
        element.classList.add("btn", "btn-secondary");
        element.addEventListener("click", this.props.logout);

        element.innerText = "Logout";

        return element;
    }

    /**
     * Nav content, including the UL and the logout button
     *
     * @return {object}
     */
    navContent() {
        const element = document.createElement("div");
        element.classList.add("collapse", "navbar-collapse");
        element.id = "navContent";

        element.append(this.navUl(), this.logoutButton());

        return element;
    }

    /**
     * An icon for the toggler button
     *
     * @return {object}
     */
    togglerIcon() {
        const element = document.createElement("span");
        element.classList.add("navbar-toggler-icon");

        return element;
    }

    /**
     * A button to open the menu when we're at narrow widths
     *
     * @return {object}
     */
    toggler() {
        const toggler = document.createElement("button");
        toggler.classList.add("navbar-toggler");
        toggler.type = "button";
        toggler.dataset.bsToggle = "collapse";
        toggler.dataset.bsTarget = "#navContent";
        toggler.setAttribute("aria-controls", "navContent");
        toggler.setAttribute("aria-expanded", false);
        toggler.setAttribute("aria-label", "Toggle navigation");

        toggler.append(this.togglerIcon());

        return toggler;
    }

    /**
     * The main nav, with brand, toggler and content
     *
     * @return {object}
     */
    render(props={}) {
        this.props = props;
        console.log("nav", props);

        const element = document.createElement("nav");
        element.classList.add(
            "navbar",
            "navbar-expand-md",
            "bg-body-tertiary",
            "sticky-top"
        );

        element.append(
            this.navbarBrand(),
            this.toggler(),
            this.navContent()
        );

        return element;
    }
};
