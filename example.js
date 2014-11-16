var morse = require("morse-beep");
var code = morse();
var output = document.getElementById("output");
var talk = document.getElementById("talk");

code.on("start-letter", function(l){
	l = l == " " ? "&nbsp;" : l;
	output.innerHTML += l;
});


var toPlay = [];
var playing = false;

var next = function(){
	var say = prompt("what to say?", "hello world");
	if(say!==null){
		if(playing){
			toPlay.push(say);
		}
		else{
			playing = true;
			code(say, after);
		}
	}
}

var after = function(){
	output.innerHTML += "<br/>";
	if(toPlay.length==0){
		playing = false;
	}
	else{
		var next = toPlay[0];
		toPlay = toPlay.slice(1);
		code(next, after);
	}
}

talk.onclick = next;