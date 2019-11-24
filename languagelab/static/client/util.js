const exports = {};

exports.findItem = function(items, id) {
    return items.find((item) => item.id === id);
};

exports.formatDuration = function(durationMoment, fixed=6) {
    var seconds = durationMoment.seconds()
        + durationMoment.milliseconds() / 1000;

    return [
        durationMoment.hours().toString().padStart(2, "0"),
        durationMoment.minutes().toString().padStart(2, "0"),
        seconds.toFixed(fixed).padStart(2, "0")
        ].join(":");
};

export default exports;