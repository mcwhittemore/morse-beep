# Morse Beep

A simple text to Morse Code player for the modern web

## Example

### index.html

```html
<script src="./compiled.js"></script>
```

### example.js (compiled.js is made with browserify)

```js
var MorseBeep = require("morse-beep");
var beeper = MorseBeep();
beeper("hello world", function(){
	console.log("done");
});
```

## API

### MorseBeep(opts)

Creates a new beeper with the provided options. You should really make sure you only have one active beeper at a time. Maybe in the future I'll add support for that.

**options**

* unit: the length of a sigle `dit`
* gap: the length between any two `dits` or `dahs`

### beeper(msg, cb)

a beeper takes a string and converts it into beeps. When the sequence is finished the callback is called.

* msg: a string. Only 0-9, space, a-z, and A-Z will be beeped. All other charters will emit events but will not effect the played sounds.

### beeper.on(event, cb)

Beeper emits events through out the beeping processes.

* start-letter: emited just before each letter is played
* end-letter: emitted when each letter is finished
* start-beep: emitted when a beep starts
* end-beep: emitted whena  beed ends