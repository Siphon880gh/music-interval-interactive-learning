/**
 * Author: Weng Fei Fung
 * Link: https://github.com/Siphon880gh
 * 
 * This is a js library that allows you to play notes by giving a letter with or without accidental (eg. Ab, A, A#), octave (-num, 0, num), and bpm or beat duration. Currently the playback uses the crude Web API. In the future, the sounds will be better.
 * 
 * The logic and math are based on these links
 * 1. Music math explained at: http://teropa.info/blog/2016/08/10/frequency-and-pitch.html
 * 2. Web API Audio context explained at: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext 
 * 
 */

/**
 * @class
 * 
 * Notes Player class
 * 
 */
class NotesPlayer {
  constructor() {
     this.NOTES = {"PAUSE": 0.1, "C": 261.63,"C#": 277.18,"Db": 277.18,"D": 293.66,"D#": 311.13,"Eb": 311.13,"E": 329.63,"F": 349.23,"F#": 369.99,"Gb": 369.99,"G": 392,"G#": 415.30,"Ab":415.30,"A": 440,"A#": 466.16,"Bb": 466.16,"B": 493.88 };

     let audioContextClass = window.AudioContext || window.webkitAudioContext;
     this.context = new audioContextClass();
  }
} // NotesPlayer

/**  
* @function
* Obsoleted: Kept here just in case. Is obsoleted by another function that reduces the click sound based on this article:
*            http://alemangui.github.io/blog//2015/12/26/ramp-to-value.html
* Play note given musical note, octave (), duration (in seconds with decimals, eg. 2.33), 
*
* @param {string} note - musical note (eg. Ab, A, A#)
* @param {integer} octave - eg. -2, -1, 0, 1, 2 such that 0 represents no octave shift
* @param {integer} bpm - eg. 60 OR null
* @param {float} durationSecondsPerBeat - OPTIONAL. eg. 1, 2, 2.33. If duration is not provided, then we are assuming 4 notes per measure and the duration per beat will be calculated by the BPM; Otherwise, you could pass a duration for that note to override that calculation (and you could pass null to bpm).
*
*/
NotesPlayer.prototype.playObsoleted = function(note, octave, bpm=60, durationSecondsPerBeat=1/(bpm/60)) {
  let context = this.context,
      freq = this.NOTES[note],
      octaveFactor = Math.pow(2, octave);

  console.log(`Playing note ${note} at ${octave===0?"same octave":(octave>0?"+"+octave+" octave":octave+" octave")} for ${durationSecondsPerBeat} seconds at ${bpm}bpm`);

  var o = context.createOscillator();
  o.frequency.setTargetAtTime(freq * octaveFactor, context.currentTime, 0);
  g = context.createGain();
  g.gain.setTargetAtTime(durationSecondsPerBeat, context.currentTime, 0);
  o.start(0);
  o.connect(context.destination);
  o.stop(context.currentTime + durationSecondsPerBeat);
}


/**  
* @function
* Play note given musical note, octave (), duration (in seconds with decimals, eg. 2.33), 
*
* @param {string} note - musical note (eg. Ab, A, A#)
* @param {integer} octave - eg. -2, -1, 0, 1, 2 such that 0 represents no octave shift
* @param {integer} bpm - eg. 60 OR null
* @param {float} durationSecondsPerBeat - OPTIONAL. eg. 1, 2, 2.33. If duration is not provided, then we are assuming 4 notes per measure and the duration per beat will be calculated by the BPM; Otherwise, you could pass a duration for that note to override that calculation (and you could pass null to bpm).
*
*/
NotesPlayer.prototype.play = function(note, octave=0, bpm=60, durationSecondsPerBeat=1/(bpm/60)) {
let context = this.context,
    freq = this.NOTES[note],
    octaveFactor = Math.pow(2, octave);

console.log(`Playing note ${note} at ${octave===0?"same octave":(octave>0?"+"+octave+" octave":octave+" octave")} for ${durationSecondsPerBeat} seconds at ${bpm}bpm`);

var o = context.createOscillator();
o.frequency.setTargetAtTime(freq * octaveFactor, context.currentTime, 0);
g = context.createGain();
o.connect(g);
g.connect(context.destination);
o.start();

// Formula:
// g.gain.setTargetAtTime(0, context.currentTime + SECONDS_OF_PLAYING, TRANSITIONING);
// TRANSITIONING is the timeConstraint parameter:
// https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
g.gain.setTargetAtTime(0, context.currentTime + .3, 1);
}

/**  
* @function
* Pause to allow your notes to play sequentially or simultaneously part way through a beat. 
* If playing a chord, then call play multiple times without a pause inbetween.
*
* @param {string} ms - The pause in milliseconds
* 
*/

NotesPlayer.prototype.pause = function(ms) {
  console.log(`Pausing for ${ms} milliseconds.`);

  const startTime = new Date().getTime();
  for(var i = 0; i < 1e14; i++) { // originally 1e7 but 1e14 is more precise when 30bpm and you dont want overlapping beats
      let currentTime = new Date().getTime();
      if( (currentTime - startTime) > ms ) break;
  } // for
}

/**
* Usage Examples:
* 
* BPM 60
  var player1 = new NotesPlayer();
  player1.play("A#", 0, 60);
* 
* BPM 120
  var player1 = new NotesPlayer();
  player1.play("A#", 0, 120);
*
*
* 1 second on this beat (ignore BPM)
  var player1 = new NotesPlayer();
  player1.play("A#", 0, null, 1);
* 
*
* Higher octave:
  var player1 = new NotesPlayer();
  player1.play("A#", 1, 60);
*
*
* Lower octave:
  var player1 = new NotesPlayer();
  player1.play("A#", 1, 60);
*
* More examples in README.md
* 
*/