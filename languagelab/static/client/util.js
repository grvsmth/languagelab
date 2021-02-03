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

exports.biggerId = function(firstItem, secondItem) {
    if (secondItem.id >= firstItem.id) {
        return secondItem;
    }
    return firstItem;
};

exports.maxId = function(items) {
    if (items.length < 1) {
        return -1;
    }
    return items.reduce(exports.biggerId).id;
};

exports.truncateString = function(stringText, limit=5) {
    if (stringText.length < limit) {
        return stringText;
    }

    return stringText.substring(0, limit - 1) + "…";
};

export default exports;
