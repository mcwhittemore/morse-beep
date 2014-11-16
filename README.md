# Morse Beep

A simple text to Morse Code player for the modern web

## Example

### index.html

```html
<div id="output">Letters will show up as their sequence starts to play</div>
<button id="talk">Enter Pharse</button>
<script src="./compiled.js"></script>
```

### example.js

```js
var morse = require("morse-beep");
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
```

## API

Docs to come