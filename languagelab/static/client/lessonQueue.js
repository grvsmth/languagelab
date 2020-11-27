
export default class LessonQueue extends React.Component {

    itemContent(item) {
        return React.createElement(
            "div",
            {},
            JSON.stringify(item)
        );
    }

    item(queueItem, queueIndex) {
        const classes = ["carousel-item"];
        if (queueIndex == 0) {
            classes.push("active");
        }
        return React.createElement(
            "div",
            {
                "key": queueIndex,
                "className": classes.join(" ")
            },
            this.itemContent(queueItem)
        );
    }

    inner() {
        return React.createElement(
            "div",
            {"className": "carousel-inner"},
            this.props.queue.map(this.item.bind(this))
        );
    }

    controlPrev() {
        return React.createElement(
            "a",
            {
                "href": "#lessonCarousel",
                "className": "carousel-control-prev",
                "role": "button",
                "data-slide": "prev"
            },
            "Prev"
        );
    }

    controlNext() {
        return React.createElement(
            "a",
            {
                "href": "#lessonCarousel",
                "className": "carousel-control-next",
                "role": "button",
                "data-slide": "next"
            },
            "Next"
        );
    }

    render() {
        return React.createElement(
            "div",
            {
                "id": "lessonCarousel",
                "className": "carousel slide"

            },
            this.inner(),
            this.controlPrev(),
            this.controlNext()
        );
    }

}