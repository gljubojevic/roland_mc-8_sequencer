﻿/// <reference path="MC8Analyzer.js" />
/// <reference path="MC8SequencerChannel.js" />

var MC8Sequencer = function () {
	// Config
	var config = {
		selCVPrefixId: '#selCV',
		tbxTempoId: '#tbxTempo',
		tbxTimeBaseId: '#tbxTimeBase',
		tbxCurrentStepId: '#tbxCurrentStep',
		btnPlayPauseId: '#btnPlayPause',
		btnStopId: '#btnStop',
		rowsBeforeEdit: 5,
		rowsAfterEdit: 5
	};

	var _sequencer = this;

	var _channels; 		// All chennels
	var _tempo; 			// Current tempo
	var _timeBase; 			// Current timebase
	var _playingTimer = null; // Indication sequencer playing or not
	var _currentStep = 0;

	// UI ref
	var _selCV = null;
	var _tbxTempo = null;
	var _tbxTimeBase = null;
	var _tbxCurrentStep = null;

	/////////////////////////////
	// Playback
	/////////////////////////////

	this.sequencerStep = function () {
		// Run sequencer on all channels
		for (var i = 0; i < _channels.length; i++) {
			_channels[i].sequencerRun();
		}

		_currentStep++;
		_tbxCurrentStep.val(_currentStep);
	}

	this.sequencerSetTimer = function () {
		// Calculate timeout
		var timeOut = (60 * 1000) / _tempo / _timeBase;

		// Start Timer
		_playingTimer = setTimeout(
			function () {
				_sequencer.sequencerStep();
				_sequencer.sequencerSetTimer();
			}, timeOut
		);
	}

	this.sequencerClearTimer = function () {
		if (null != _playingTimer) {
			clearTimeout(_playingTimer);
			_playingTimer = null;
			return true;
		}

		return false;
	}


	this.playPauseSequencer = function () {
		// Pause
		if (this.sequencerClearTimer()) {
			return;
		}

		// Play
		this.sequencerSetTimer();
	}

	this.stopSequencer = function () {
		// Remove timer
		this.sequencerClearTimer();

		// Reset current step
		_currentStep = 0;
		_tbxCurrentStep.val(_currentStep);

		// Reset all channels
		for (var i = 0; i < _channels.length; i++) {
			_channels[i].sequencerStop();
		}
	}


	/////////////////////////////
	// Channel assigment
	/////////////////////////////
	this.CVAssign = function (cv, ch) {
		// Check if allready assigned to same channel
		if (-1 != ch && _channels[ch].CVCheckAssigned(cv))
		{ return; }

		// Remove CV from existing channel			
		for (var i = 0; i < _channels.length; i++)
		{ _channels[i].CVRem(cv); }

		// Add to new channel
		if (-1 != ch)
		{ _channels[ch].CVAdd(cv); }
	}

	this.CVShowAssigment = function (cv, ch) {
		$('option:selected', _selCV[cv]).attr('selected', false);
		$('option[value=' + ch + ']', _selCV[cv]).attr('selected', true);
	}

	/////////////////////////////
	// Load sequencer memory
	/////////////////////////////

	var MC8MemoryStart = 0x4000;
	var MC8MemoryMask = MC8MemoryStart - 1;
	var MC8MemorySize = 0x4000;
	var MC8EOB = 0xff;
	var MC8SongConfig = 0x400c; // Song definition starts at this address

	var MC8CVCheckMask = 0xc0; // When two high bits are 0 than this is CV data
	var MC8CVCHMask = 0x07; 	// Channel/CV mask, channel is always 3 lower bits, CV is bits 3-5
	var MC8StepMask = 0xc0; 	// Mask for determining step two high bits are one -> %11000000
	var MC8GateMask = 0xe0; 	// Mash for determining gate three high bits are one -> %11100000

	var _MC8Memory;

	this.resetMC8Memory = function () {
		// Init MC-8 memory
		_MC8Memory = new Array(MC8MemorySize);
		for (var i = 0; i < _MC8Memory.length; i++) {
			_MC8Memory[i] = 0;
		}
	}

	// load bytes in memory
	this.loadMC8Memory = function (dataBytes) {
		this.resetMC8Memory();

		var checksum;
		var memAddress;
		var blockSize;
		var pos = 0;
		while (0 < dataBytes[pos]) {
			checksum = dataBytes[pos];
			blockSize = dataBytes[pos++];

			checksum += dataBytes[pos];
			checksum += dataBytes[pos + 1];
			memAddress = ((dataBytes[pos++] << 8) | dataBytes[pos++]) & MC8MemoryMask;

			for (var i = 0; i < blockSize; i++) {
				checksum += dataBytes[pos];
				_MC8Memory[memAddress++] = dataBytes[pos++];
			}

			// Check Checksum
			checksum = ((checksum ^ 0xff & 0xff) + 1) & 0xff;
			if (checksum != dataBytes[pos++])
			{ throw "Invalid checksum found at byte:" + (pos - 1); }

			// Check end od block
			if (MC8EOB != dataBytes[pos++])
			{ throw "Missing end of block marker at byte:" + (pos - 1); }
		}
	}


	this.loadSequenceData = function () {
		// Get song config address in array
		var pos = MC8SongConfig & MC8MemoryMask;

		pos++; // Skip unknown byte
		pos++; // Skip unknown byte

		_tempo = (_MC8Memory[pos++] & 0x7f) * 2; // Get Tempo
		_timeBase = _MC8Memory[pos++]; 			// Get Time base
		_currentStep = 0;

		// Read song until end of song reached
		while (MC8EOB != _MC8Memory[pos]) {
			var dataType = _MC8Memory[pos++]; 	// Get what we load
			var ch = dataType & MC8CVCHMask; 	// Extract channel

			// From where to load
			var dataFrom = (_MC8Memory[pos++] | (_MC8Memory[pos++] << 8)) & MC8MemoryMask;
			var dataTo = (_MC8Memory[pos + 1] | (_MC8Memory[pos + 2] << 8)) & MC8MemoryMask;
			var dataLen = dataTo - dataFrom;

			if (0 == (dataType & MC8CVCheckMask)) {
				// this is CV
				var cv = (dataType >> 3) & MC8CVCHMask;
				_channels[ch].CVAdd(cv);
				_channels[ch].loadCV(cv, dataFrom, dataLen, _MC8Memory);

				// Sync channel slecetion 
				this.CVShowAssigment(cv, ch);
			}
			else if (MC8GateMask == (dataType & MC8GateMask)) {
				// this is Gate, NOTE: Gate must be checked BEFORE step time
				_channels[ch].loadGate(dataFrom, dataLen, _MC8Memory);
			}
			else if (MC8StepMask == (dataType & MC8StepMask)) {
				// this is Step
				_channels[ch].loadStep(dataFrom, dataLen, _MC8Memory);
			}
		}
	}

	// Data is byte array
	this.loadSequence = function (data) {
		// TODO: Reset current channels
		this.loadMC8Memory(data);
		this.loadSequenceData();

		// Display sequence data
		_tbxTempo.val(_tempo);
		_tbxTimeBase.val(_timeBase);
		_tbxCurrentStep.val(_currentStep);

		// Display channel data
		for (var i = 0; i < _channels.length; i++) {
			_channels[i].displayNotes();
		}
	}


	/////////////////////////////
	// Init
	/////////////////////////////

	// Init and attach
	this.initSequencer = function () {

		// Create empty channels
		_channels = new Array();
		for (var i = 0; i < 8; i++) {
			var chn = new MC8SequencerChannel(i, config.rowsBeforeEdit, config.rowsAfterEdit);
			chn.Init();
			_channels.push(chn);
		}

		// Init channel assigment
		_selCV = new Array();

		for (var i = 0; i < 8; i++) {
			var ops = '<option value="-1">CH--</option>';
			for (var j = 0; j < 8; j++) {
				ops += '<option value="' + j + '">CH' + j + '</option>';
			}

			var sel = $(config.selCVPrefixId + i);
			sel.append(ops);

			sel.change(function () {
				var ch = parseInt($(this).val());
				var cv = parseInt($(this).attr('id').replace(config.selCVPrefixId.replace('#', ''), ''));
				_sequencer.CVAssign(cv, ch);
			});

			// Store ref for later use
			_selCV.push(sel);
		}

		// Init text boxes
		_tbxTempo = $(config.tbxTempoId);
		_tbxTempo.change(function () {
			_tempo = $(this).val();
		});

		_tbxTimeBase = $(config.tbxTimeBaseId);
		_tbxTimeBase.change(function () {
			_timeBase = $(this).val();
		});

		_tbxCurrentStep = $(config.tbxCurrentStepId);

		// btn Play/Pause
		$(config.btnPlayPauseId).click(function () {
			_sequencer.playPauseSequencer();
		});

		// btn Stop
		$(config.btnStopId).click(function () {
			_sequencer.stopSequencer();
		});
	};

	// Return entire object
	return this;
} ();