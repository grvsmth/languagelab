const exports = {};

exports.findItem = function(items, id) {
    return items.find((item) => item.id === id);
};

exports.duration = function() {

};

export default exports;