/**
 * Utility functions for Language Lab classes
 *
 * Angus B. Grieve-Smith, 2021
 */

const exports = {};

exports.findItem = function(items, id) {
    return items.find((item) => item.id === id);
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

export default exports;
