'use strict';
/**
 * BasicSynth instrument.
 * @param {object} context: instance of the audio context.
 * @param {int} note: default note to be played.
 */
function BasicSynth(context, note) {
	this.context = context;
	this.note = note;

	this.vco = this.context.createOscillator();
	this.vco.frequency.value = this.noteToFrequency(note);
	this.lfo = this.context.createOscillator();
	this.lfoGain = this.context.createGain();
	this.vcf = this.context.createBiquadFilter();
	this.output = this.context.createGain();
	this.vco.connect(this.vcf);
	this.lfo.connect(this.lfoGain);
	this.lfoGain.connect(this.vcf.frequency);
	this.vcf.connect(this.output);
	this.output.gain.value = 0;
	this.vco.type = 'sawtooth';
	this.lfo.type = 'sawtooth';
	this.vco.start(this.context.currentTime);
	this.lfo.start(this.context.currentTime);
	this.volume = this.context.createGain();
	this.volume.gain.value = 0.4;
	this.output.connect(this.volume);
	this.volume.connect(this.context.destination);
}

BasicSynth.prototype.noteToFrequency = function(note) {
	var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	var keyNumber;
	var octave;

	if (note.length === 3) {
		octave = note.charAt(2);
	} else {
		octave = note.charAt(1);
	}

	keyNumber = notes.indexOf(note.slice(0, -1));

	if (keyNumber < 3) {
		keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
	} else {
		keyNumber = keyNumber + ((octave - 1) * 12) + 1;
	}

	return 440 * Math.pow(2, (keyNumber - 49) / 12);
};

BasicSynth.prototype.setup = function(note) {

	/*
	this.osc = this.context.createOscillator();

	this.osc.frequency.value = this.noteToFrequency(note);

	this.gain = this.context.createGain();
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination)
	*/
};

BasicSynth.prototype.trigger = function(time, props, note) {
	note = note || this.note || 'C';

	console.log(time, props);

	// this.setup(note);

	var frequency = this.noteToFrequency(note);

	this.vco.frequency.setValueAtTime(frequency, time);

	// attack
	this.output.gain.setValueCurveAtTime(new Float32Array([0, 1]), time, props.attack);
	// decay
	this.output.gain.setValueCurveAtTime(new Float32Array([1, 0.8]),
		time + props.attack,
		props.decay);
	// sustain
	// relase
	this.output.gain.setValueCurveAtTime(new Float32Array([0.8, 0]),
		time + props.attack + props.decay + props.sustain,
		props.release);

	this.vco.stop(time + props.attack + props.decay + props.sustain + props.release);

	/*
	this.gain.gain.setValueAtTime(0.1, time);
	//this.gain.gain.setValueAtTime(0.01, time + duration);
	this.gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

	this.osc.start(time);

	this.osc.stop(time + duration);
	*/
};

BasicSynth.prototype.play = function(props, note) {
	// note = note || this.note || 'C';
	var now = this.context.currentTime;
	this.trigger(now, props, note);
};

BasicSynth.prototype.clone = function(note) {
	var synth = new BasicSynth(this.context, note || this.note);
	return synth;
};

module.exports = BasicSynth;
