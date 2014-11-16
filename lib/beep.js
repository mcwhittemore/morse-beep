module.exports = function (type) {
    var ctx = new(window.audioContext || window.webkitAudioContext);
    return function (duration, cb) {

        duration = +duration;

        // Only 0-4 are valid types.
        type = (type % 5) || 0;

        if (typeof cb != "function") {
            cb = function () {};
        }

        var osc = ctx.createOscillator();

        osc.type = type;

        osc.connect(ctx.destination);
        osc.noteOn(0);

        setTimeout(function () {
            osc.noteOff(0);
            cb();
        }, duration);

    };
}