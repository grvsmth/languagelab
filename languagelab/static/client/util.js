const exports = {};

exports.findItem = function(items, id) {
    return items.find((item) => item.id === id);
};

exports.duration = function(url) {
    const audio = React.createElement(
        "audio",
        {"src": url},
        null
    );
    console.dir(audio);
    audio.addEventListener("loadedmetadata", (event) => {
        console.dir("loadedmetadata", event);
        console.log("duration", "event.target.duration");
    });
};

export default exports;