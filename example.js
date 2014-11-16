var morse = require("../index.js");
var code = morse();
var output = document.getElementById("output");
var talk = document.getElementById("talk");

code.on("start-letter", function(l){
	l = l == " " ? "&nbsp;" : l;
	output.innerHTML += l;
});

var next = function(){
	output.innerHTML += "<br/>";
	var say = prompt("what to say?", "hello world");
	if(say!==null){
		code(say, next);
	}
}

talk.onclick = next;