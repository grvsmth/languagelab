const exports = {};

exports.findItem = function(items, id) {
    return items.find((item) => item.id === id);
};


export default exports;