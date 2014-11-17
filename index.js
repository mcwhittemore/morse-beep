var lettersToMorse = {
	"a": ".-",
	"b": "-...",
	"c": "-.-.",
	"d": "-..",
	"e": ".",
	"f": "..-.",
	"g": "--.",
	"h": "....",
	"i": "..",
	"j": ".---",
	"k": "-.-",
	"l": ".-..",
	"m": "--",
	"n": "-.",
	"o": "---",
	"p": ".--.",
	"q": "--.-",
	"r": ".-.",
	"s": "...",
	"t": "-",
	"u": "..-",
	"v": "...-",
	"w": ".--",
	"x": "-..-",
	"y": "-.--",
	"z": "--..",
	"1": ".----",
	"2": "..---",
	"3": "...--",
	"4": "....-",
	"5": ".....",
	"6": "-....",
	"7": "--...",
	"8": "---..",
	"9": "----.",
	"0": "-----"
}

module.exports = function(opts){

	opts = opts || {};
	var unit = opts.unit || 25;
	var gap = opts.gap || 10;

	var beeper = require("./lib/beep")(0);

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
			if(l=="."){
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

	var sayer = function(msg, cb){
		cb = cb || function(){};
		msg = msg.toLowerCase();
		say(msg, cb);
	}

	sayer.on = function(key, fn){
		listeners[key] = listeners[key] || [];
		listeners[key].push(fn);
	}

	return sayer;
}
