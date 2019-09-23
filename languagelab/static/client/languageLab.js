const exports = {};

exports.init = function() {
    const navAnchors = document.body.querySelectorAll("#navContent a");
    navAnchors.forEach((anchor) => {
        exports.addClick(anchor.id, exports.handleClick);
    });

    const resultsP = document.querySelector("#resultsP");
    resultsP.innerHTML = "Initialized";
    console.log("Initialized");
};

exports.handleClick = function(event) {
    console.log(event);
    console.log(event.target);

};

exports.addClick = function(anchorId, handler) {
    const anchor = document.body.querySelector("#" + anchorId);
    anchor.onclick = handler;
}

export default exports;