const exports = {};

exports.fetchData = function(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then((res) => {
            resolve(res.json());
        }, (err) => {
            reject(err);
        });
    });
};

exports.handleClick = function(event) {
    console.log(event);
    console.log(event.target);

};

export default exports;