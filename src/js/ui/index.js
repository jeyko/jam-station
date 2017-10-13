'use strict';

const {div} = require('iblokz-snabbdom-helpers');
const header = require('./header');
const mediaLibrary = require('./media-library');
const instrument = require('./instrument');
const sequencer = require('./sequencer');
const midiMap = require('./midi-map');
const midiKeyboard = require('./midi-keyboard');

const panels = {
	mediaLibrary,
	instrument,
	sequencer,
	midiMap,
	midiKeyboard
};

module.exports = ({state, actions, tapTempo}) => div('#ui', [
	header({state, actions, tapTempo}),
	div('#layout', Object.keys(panels).map((panel, index) =>
		state.ui[panel] ? panels[panel]({state, actions, params: {
		}}) : ''
	))
]);
