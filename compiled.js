(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var morse = require("morse-beep");
var code = morse();
var input = document.getElementById("input");
var output = document.getElementById("output");
var talk = document.getElementById("talk");
var max = 0;
var cur = 0;

input.onkeyup = function(e){ 
  if(e.keyCode==13){ 
  	next();
  }
}

function clearActive(){
	var actives = output.getElementsByClassName("active");
	for(var i=0; i<actives.length; i++){
		actives[i].classList.remove("active");
	}
}

code.on("start-letter", function(){
	clearActive();

	var div = document.getElementById("say-"+cur);
	var spans = div.getElementsByClassName("waiting");
	if(spans.length>0){
		var span = spans[0]
		span.classList.remove("waiting");
		span.classList.add("active");
	}
});


var toPlay = [];
var playing = false;

var next = function(){
	var say = input.value.toUpperCase();
	if(say!==null){
		
		var divStart ="<div id='say-"+max+"'>";
		var spanStart = "<span class='waiting'>";
		var spanEnd = "</span>"
		var spans = "";
		say.split("").forEach(function(a){
			if(a==" "){
				a = " _ ";
			}
			spans+=spanStart+a+spanEnd;
		});
		var divEnd = "</div>";
		output.innerHTML += divStart+spans+divEnd;

		max++;

		if(playing){
			toPlay.push(say.toLowerCase());
		}
		else{
			playing = true;
			code(say.toLowerCase(), after);
		}
	}
	input.value = "";
}

var after = function(){
	cur++;
	if(toPlay.length==0){
		playing = false;
		clearActive();
	}
	else{
		var next = toPlay[0];
		toPlay = toPlay.slice(1);
		code(next, after);
	}
}

talk.onclick = next;
},{"morse-beep":2}],2:[function(require,module,exports){
var lettersToMorse = {
	"a": "sl",
	"b": "lsss",
	"c": "lsls",
	"d": "lss",
	"e": "s",
	"f": "ssls",
	"g": "lls",
	"h": "ssss",
	"i": "ss",
	"j": "slll",
	"k": "lsl",
	"l": "slll",
	"m": "ll",
	"n": "ls",
	"o": "lll",
	"p": "slls",
	"q": "llsl",
	"r": "sls",
	"s": "sss",
	"t": "l",
	"u": "ssl",
	"v": "sssl",
	"w": "sll",
	"x": "lssl",
	"y": "lsll",
	"z": "llss",
	"1": "sllll",
	"2": "sslll",
	"3": "sssll",
	"4": "ssssl",
	"5": "sssss",
	"6": "lssss",
	"7": "llsss",
	"8": "lllss",
	"9": "lllls",
	"0": "lllll"
}

module.exports = function(opts){

	opts = opts || {};
	var unit = opts.unit || 25;
	var gap = opts.gap || 10;

	var beeper = require("./lib/beep")(opts.beep || 0);

	var beep = function(num, cb){
		emit("start-beep");
		beeper(gap*num, function(){
			emit("end-beep");
			setTimeout(cb, unit*gap);
		});
	}

	var long = function(cb){
		cb = cb || function(){};
		beep(3*unit, cb);
	}

	var short = function(cb){
		cb = cb || function(){};
		beep(unit, cb);
	}

	var pause = function(cb){
		setTimeout(cb, 2*unit*gap);
	}

	var space = function(cb){
		setTimeout(cb, 4*unit*gap);
	}

	var parse = function(str,cb){
		if(str.length){
			var l = str[0];
			str = str.slice(1);
			if(l=="s"){
				short(function(){
					parse(str,cb);
				});
			}
			else{
				long(function(){
					parse(str, cb);
				});
			}
		}
		else{
			pause(cb);
		}
	}

	var say = function(msg, cb){
		cb = cb || function(){};
		if(msg.length){
			var l = msg[0];
			emit("start-letter", l);
			msg = msg.slice(1);
			var code = lettersToMorse[l];
			if(code){
				parse(code, function(){
					emit("end-letter", l);
					say(msg, cb);
				});
			}
			else if(l==" "){
				space(function(){
					emit("end-letter", l);
					say(msg, cb);
				});
			}
			else{
				emit("end-letter", l);
				say(msg, cb);
			}
		} 
		else{
			cb();
		}
	}

	var listeners = {"start":[], "stop":[]};

	var emit = function(key, value){
		listeners[key] = listeners[key] || [];
		for(var i=0; i<listeners[key].length; i++){
			listeners[key][i](value);
		}
	}

	say.on = function(key, fn){
		listeners[key] = listeners[key] || [];
		listeners[key].push(fn);
	}

	return say;
}
},{"./lib/beep":3}],3:[function(require,module,exports){
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
},{}]},{},[1]);
