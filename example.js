var morse = require("morse-beep");
var code = morse();
var output = document.getElementById("output");
var talk = document.getElementById("talk");

code.on("start-letter", function(l){
	l = l == " " ? "&nbsp;" : l;
	output.innerHTML += l;
});

var beeping = false;
var next = function(){
	var say = prompt("what to say?", "hello world");
	if(say!==null){
		code(say, function(){
			output.innerHTML += "<br/>";
		});
	}
}

talk.onclick = next;