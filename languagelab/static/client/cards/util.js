/**
 * Utilities used by cards and their elements
 *
 * Angus B. Grieve-Smith, 2021
 *
 */

/*

    global moment

*/

import config from "./config.js";

const exports = {};

/**
 * Format a time curation as 00:00:00.000.  The target string length for
 * padStart for seconds has to include the decimal point and following digits.
 *
 * @param {moment} durationMoment - the duration as a Moment object
 * @param {number} fixed - the number of total figures for seconds
 *
 * @return {string}
 */
exports.formatDuration = function(durationMoment, fixed=5) {
    const seconds = durationMoment.seconds()
        + durationMoment.milliseconds() / 1000;

    const secondsStringLength = fixed + 3;

    const durationString = [
        durationMoment.hours().toString().padStart(2, "0"),
        durationMoment.minutes().toString().padStart(2, "0"),
        seconds.toFixed(fixed).padStart(secondsStringLength, "0")
        ].join(":");
    return durationString;
};

/**
 * Format the start and end times and combine them into a string
 *
 * @param {string} startTime
 * @param {string} endTime
 * @param {string} timeFormat - for parsing the start and end times
 *
 * @return {string}
 */
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

/**
 * Reduce an array of items to an object where each item is a property
 * identified by that item's "id" property
 *
 * @param {array} inputList
 *
 * @return {object}
 */
exports.listToObject = function(inputList) {
    return inputList.reduce((object, item) => {
            object[item.id] = item.name;
            return object;
        }, {}
    );
};

/**
 * Format the number of exercises as a string with the appropriately inflected
 * noun
 *
 * @param {array} queueItems
 *
 * @return {string}
 */
exports.howManyExercises = function(queueItems) {
    if (queueItems.length == 1) {
        return "1 exercise";
    }

    return queueItems.length + " exercises";
};

/**
 * If a string is longer than the limit, truncate it so that it can fit within
 * the limit, with the ellipsis "…" character
 *
 * @param {string} stringText
 * @param {number} limit
 *
 * @return {string}
 */
exports.truncateString = function(stringText, limit=5) {
    if (stringText.length < limit) {
        return stringText;
    }

    return stringText.substring(0, limit - 1) + "…";
};

/**
 * Return the value of a form field node, making appropriate conversions to send
 * a JSON to the API:
 *
 * * checkbox - boolean
 * * tags - array
 * * language - int
 *
 * @param {object} node
 *
 * @return {string}
 */
exports.processField = function(node) {
    if (node.type === "checkbox") {
        return node.checked;
    }

    if (node.name === "tags") {
        if (node.value.length < 1) {
            return [];
        }
        const tags = node.value.split(config.tagSplitRE);
        return tags;
    }

    if (node.name === "language") {
        return parseInt(node.value);
    }

    return node.value;
};

/**
 * Trim whitespace from each tag and join it into a comma/space delimited string
 *
 * @param {array} tags
 *
 * @return {string}
 */
exports.joinTags = function(tags) {
    if (tags) {
        return tags.map(tag => tag.trim()).join(", ");
    }
    return "";
}

export default exports;
