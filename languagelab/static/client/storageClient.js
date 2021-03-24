/**
 * Client for persistent Language Lab data storage
 *
 * Angus B. Grieve-Smith, 2021
 */

const launchFields = [
    "currentUser",
    "token",
    "tokenLife",
    "tokenTime"
];

const exports = {
    "loadItem": function(storedData, fieldName) {
        /**
         * Get an item from storage and set it in the storedData object
         *
         * @param {object} storedData
         * @param {string} fieldName - the field name for storage and object
         *
         * @return {object}
         */
        storedData[fieldName] = localStorage.getItem(fieldName);
        return storedData;
    },
    "setItem": function(fieldName, itemValue) {
        /**
         * Store the itemValue under the fieldName
         *
         * @param {string} fieldName
         * @param {string} itemValue
         */
        localStorage.setItem(fieldName, itemValue);
    },
    "setToken": function(token, tokenTime, tokenLife=this.tokenLife) {
        /**
         * Set the token info in storage
         *
         * @param {string} token
         * @param {string} tokenTime - the time when the token was refreshed
         * @param {string} tokenLife
         */
        localStorage.setItem("token", token);
        localStorage.setItem("tokenTime", tokenTime);
        localStorage.setItem("tokenLife", tokenLife);
    }
};

/**
 * Return the stored data for each of the launch fields
 *
 * @return {object}
 */
exports.launchData = function() {
    return launchFields.reduce(exports.loadItem, {});
};

/**
 * Set the local storage for a field name to the empty string
 *
 * @param {string} fieldName
 */
exports.clearItem = function(fieldName) {
    exports.setItem(fieldName, "");
};

/**
 * Clear all the launch fields in local storage
 */
exports.clearAll = function() {
    launchFields.forEach(exports.clearItem);
};


export default exports;