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