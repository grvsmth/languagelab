/**
 * Utility functions for Language Lab classes
 *
 * Angus B. Grieve-Smith, 2021
 */

const exports = {};

/**
 * A utility function so that I don't have to mock Array.prototype.find() every
 * time I use it
 *
 * @param {array} items - the list of objects to search through, each with an id
 * @param {string} id - the ID of the object we're looking for
 *
 * @return {object}
 */
exports.findItem = function(items, id) {
    return items.find((item) => item.id === id);
};

/**
 * Return the object whose ID is bigger.  Used with maxId - see below.
 *
 * @param {object} firstItem
 * @param {object} secondItem
 *
 * @return {object}
 */
exports.biggerId = function(firstItem, secondItem) {
    if (secondItem.id >= firstItem.id) {
        return secondItem;
    }
    return firstItem;
};

/**
 * Find the largest ID so we don't use an existing ID.
 *
 * @param {array} items
 *
 * @return {number}
 */
exports.maxId = function(items) {
    if (items.length < 1) {
        return -1;
    }
    return items.reduce(exports.biggerId).id;
};

export default exports;
