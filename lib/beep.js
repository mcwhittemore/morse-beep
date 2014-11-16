module.exports = function (type) {
    var ctx = new(window.AudioContext || window.webkitAudioContext);
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
        //osc.noteOn(0);

        var start = osc.start ? osc.start.bind(osc) : osc.noteOn.bind(osc);
        var stop = osc.stop ? osc.stop.bind(osc) : osc.noteOff.bind(osc);
        start(0);


        setTimeout(function () {
            stop(0);
            cb();
        }, duration);

    };
}