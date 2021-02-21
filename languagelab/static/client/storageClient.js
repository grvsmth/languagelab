/*

    Client for persistent Language Lab data storage

*/

const launchFields = [
    "currentUser",
    "token",
    "tokenLife",
    "tokenTime"
];

const exports = {
    "storedData": function() {
        const launchData = {};
        launchFields.forEach((fieldName) => {
            launchData[fieldName] = localStorage.getItem(fieldName);
        });
        return launchData;
    },

    "logout": function() {
        launchFields.forEach((fieldName) => {
            localStorage.setItem(fieldName, "");
        });
    },

    "setItem": function(itemName, itemValue) {
        localStorage.setItem(itemName, itemValue);
    },

    /*

        Set the token, the time when the token was refreshed, and the token life

    */
    "setToken": function(token, tokenTime, tokenLife=this.tokenLife) {
        localStorage.setItem("token", token);
        localStorage.setItem("tokenTime", tokenTime);
        localStorage.setItem("tokenLife", tokenLife);
    }


};

export default exports;