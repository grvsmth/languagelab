import MediaCardList from "./mediaCardList.js";

export default class Lab extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
    }

    render() {

        if (this.props.clickId === "media") {
            return React.createElement(
                MediaCardList,
                {},
                null
            )
        }

        if (!this.props.clickId) {
            return React.createElement(
                "div",
                {},
                "React is running"
            )
        }

        return React.createElement(
            "div",
            {},
            `You clicked ${this.props.clickId}`
        );
    }
}