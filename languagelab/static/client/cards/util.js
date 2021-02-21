/*

    global moment

*/
const exports = {};

exports.formatDuration = function(durationMoment, fixed=6) {
    const seconds = durationMoment.seconds()
        + durationMoment.milliseconds() / 1000;

    const durationString = [
        durationMoment.hours().toString().padStart(2, "0"),
        durationMoment.minutes().toString().padStart(2, "0"),
        seconds.toFixed(fixed).padStart(2, "0")
        ].join(":");
    return durationString;
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

exports.truncateString = function(stringText, limit=5) {
    if (stringText.length < limit) {
        return stringText;
    }

    return stringText.substring(0, limit - 1) + "…";
};

export default exports;
