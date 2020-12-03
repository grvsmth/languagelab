const exports = {};

exports.findItem = function(items, id) {
    const item = items.find((item) => item.id === id);
    if (item && typeof item !== "undefined") {
        return item;
    }
    return;
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

exports.timeRange = function(startTime, endTime, timeFormat) {
    const startTimeString = exports.formatDuration(
        new moment(startTime, timeFormat),
        2
    );
    const endTimeString = exports.formatDuration(
        new moment(endTime, timeFormat),
        2
    );
    return `${startTimeString} - ${endTimeString}`;
};

exports.listToObject = function(inputList) {
    const outputObject = inputList.reduce((object, item) => {
            object[item.id] = item.name;
            return object;
        }, {}
    );
    return outputObject;
};

exports.howManyExercises = function(queueItems) {
    if (queueItems.length == 1) {
        return "1 exercise";
    }

    return queueItems.length + " exercises";
};

export default exports;
