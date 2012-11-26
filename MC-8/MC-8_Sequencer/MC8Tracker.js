/// <reference path="MC8Analyzer.js" />
/// <reference path="MC8BitStreamEncoder.js" />
/// <reference path="MC8TrackerChannel.js" />

var MC8Tracker = function () {
	// Config
	var config = {
		logViewId: '#AnalyzeLog',
		channelContainerId: '#seqChannels',
		selCVPrefixId: '#selCV',
		tbxTempoId: '#tbxTempo',
		tbxTimeBaseId: '#tbxTimeBase',
		tbxCurrentStepId: '#tbxCurrentStep',
		btnPlayPauseId: '#btnPlayPause',
		btnStopId: '#btnStop',
		btnSeqAdvance: '#btnSeqAdvance',
		btnSave: '#btnSave',
		rowsBeforeEdit: 10,
		rowsAfterEdit: 10
	};

	var _sequencer = this;

	var _channels; 				// All channels
	var _tempo = 0; 			// Current tempo
	var _timeBase = 0; 			// Current timebase
	var _currentStep = 0;
	var _playingTimer = null; // Indication sequencer playing or not

	// UI ref
	var _channelContainer;
	var _selCV = null;
	var _tbxTempo = null;
	var _tbxTimeBase = null;
	var _tbxCurrentStep = null;
	var _transportUI;
	var _transportEdit;
	var _transportAfterEdit;
	var _transportBeforeEdit;

	/////////////////////////////
	// Playback
	/////////////////////////////

	this.sequencerStep = function () {
		// Run sequencer on all channels
		for (var i = 0; i < _channels.length; i++) {
			_channels[i].sequencerRun();
		}

		// Show transport
		this.displayTransport();
		_tbxCurrentStep.val(_currentStep);

		// Next step
		_currentStep++;
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

		this.displayTransport();

		// Reset all channels
		for (var i = 0; i < _channels.length; i++) {
			_channels[i].sequencerStop();
		}
	}

	/////////////////////////////
	// Edit
	/////////////////////////////

	this.editStepUpDown = function (direction) {
		// Calculate new postion
		_currentStep += direction;

		// Don't allow negative steps
		if (0 > _currentStep) {
			_currentStep = 0;
			return;
		}

		// Show transport
		_tbxCurrentStep.val(_currentStep);
		this.displayTransport();

		// Move all channels
		for (var i = 0; i < _channels.length; i++) {
			_channels[i].editStepUpDown(direction);
		}
	}

	// Handle mouse wheel on tracker area
	// Crude but effective
	this.editHandleMouseWheel = function (delta) {
		event.preventDefault();
		if (delta > 0) {
			while (0 < delta--) {
				this.editStepUpDown(-1);
			}
		}
		else {
			while (0 > delta++) {
				this.editStepUpDown(1);
			}
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
	// Sequencer memory
	/////////////////////////////

	var MC8MemoryStart = 0x4000;
	var MC8MemoryMask = MC8MemoryStart - 1;
	var MC8MemorySize = 0x4000;
	var MC8EOB = 0xff;
	var MC8SongConfig = 0x400c; // Song definition starts at this address
	var MC8DataStart = 0x41c0; // Track data start at this address

	var MC8ByteMask = 0xff; 	// Byte mask
	var MC8CVCheckMask = 0xc0; // When two high bits are 0 than this is CV data
	var MC8CVCHMask = 0x07; 	// Channel/CV mask, channel is always 3 lower bits, CV is bits 3-5
	var MC8StepMask = 0xc0; 	// Mask for determining step two high bits are one -> %11000000
	var MC8GateMask = 0xe0; 	// Mash for determining gate three high bits are one -> %11100000
	var MC8SeventhBit = 0x80; // Seventh bit for easier usage
	var MC8SaveBlockSize = 32; // Block size in bytes

	var _MC8Memory;
	var _MC8SongSize = 0;
	var _MC8DataSize = 0;

	this.resetMC8Memory = function () {
		// Init MC-8 memory
		_MC8Memory = new Array(MC8MemorySize);
		for (var i = 0; i < _MC8Memory.length; i++) {
			_MC8Memory[i] = 0;
		}

		// Reset Values
		_MC8SongSize = 0;
		_MC8DataSize = 0;
	}

	/////////////////////////////
	// Save sequencer memory
	/////////////////////////////

	this.saveMC8MemoryBlocks = function (dataAddr, size, dataBytes) {
		var checksum;
		var addr;

		// Calculate No of blocks
		var blocks = Math.floor(size / MC8SaveBlockSize);
		if ((blocks * MC8SaveBlockSize) < size) {
			blocks++;
		}

		// Store all blocks
		for (var i = 0; i < blocks; i++) {
			// Store block end marker
			dataBytes.push(MC8SaveBlockSize);
			checksum = MC8SaveBlockSize;

			// Address Hi
			addr = ((dataAddr | MC8MemoryStart) >> 8) & MC8ByteMask;
			dataBytes.push(addr);
			checksum += addr;

			// Address Lo
			addr = (dataAddr | MC8MemoryStart) & MC8ByteMask;
			dataBytes.push(addr);
			checksum += addr;

			// Store All bytes in block and add to checksum
			for (var j = 0; j < MC8SaveBlockSize; j++) {
				dataBytes.push(_MC8Memory[dataAddr]);
				checksum += _MC8Memory[dataAddr++];
			}

			// Fix Checksum to byte and store it
			checksum = ((checksum ^ 0xff & 0xff) + 1) & 0xff;
			dataBytes.push(checksum);

			// Store block end marker
			dataBytes.push(MC8EOB);
		}
	}


	this.saveSequenceData = function () {
		this.resetMC8Memory();

		// Get song config address in array
		var songAdr = MC8SongConfig & MC8MemoryMask;
		// Get song data address in array
		var memAdr = MC8DataStart & MC8MemoryMask;

		_MC8Memory[songAdr++] = 0xfe; // Unknown byte
		_MC8Memory[songAdr++] = 0x1f; // Unknown byte

		// Tempo
		_MC8Memory[songAdr++] = (_tempo >> 1) | MC8SeventhBit;
		// Timebase
		_MC8Memory[songAdr++] = _timeBase;

		for (var ch = 0; ch < _channels.length; ch++) {
			// Check if any CVs assigned, skip channel if not
			if (0 == _channels[ch].CVAssinged) {
				continue;
			}

			// Check is there any notes, skip if not
			if (0 == _channels[ch].Notes.length) {
				continue;
			}

			// Push CVs to memory
			for (var cv = 0; cv < 8; cv++) {
				// Skip if CV is not assigned
				if (!_channels[ch].CVCheckAssigned(cv))
				{ continue }

				// Store CV dataType
				_MC8Memory[songAdr++] = (cv << 3) | ch;
				// Store Address to song memory
				_MC8Memory[songAdr++] = (memAdr | MC8MemoryStart) & MC8ByteMask; // Lo byte
				_MC8Memory[songAdr++] = ((memAdr | MC8MemoryStart) >> 8) & MC8ByteMask; // Hi byte

				// Store CV to memory
				memAdr = _channels[ch].saveCV(cv, _MC8Memory, memAdr);
			}

			// Store steptime data type
			_MC8Memory[songAdr++] = MC8StepMask | ch;
			// Store Address to song memory
			_MC8Memory[songAdr++] = (memAdr | MC8MemoryStart) & MC8ByteMask; // Lo byte
			_MC8Memory[songAdr++] = ((memAdr | MC8MemoryStart) >> 8) & MC8ByteMask; // Hi byte

			// Push steptime to memory
			memAdr = _channels[ch].saveStep(_MC8Memory, memAdr);

			// Store gate data type
			_MC8Memory[songAdr++] = MC8GateMask | ch;
			// Store Address to song memory
			_MC8Memory[songAdr++] = (memAdr | MC8MemoryStart) & MC8ByteMask; // Lo byte
			_MC8Memory[songAdr++] = ((memAdr | MC8MemoryStart) >> 8) & MC8ByteMask; // Hi byte

			// Push gates to memory
			memAdr = _channels[ch].saveGate(_MC8Memory, memAdr);
		}

		// Store end marker and last address
		_MC8Memory[songAdr++] = MC8EOB;
		// Store Address to song memory
		_MC8Memory[songAdr++] = (memAdr | MC8MemoryStart) & MC8ByteMask; // Lo byte
		_MC8Memory[songAdr++] = ((memAdr | MC8MemoryStart) >> 8) & MC8ByteMask; // Hi byte

		// Save song and data size
		_MC8SongSize = songAdr - (MC8SongConfig & MC8MemoryMask);
		_MC8DataSize = memAdr - (MC8DataStart & MC8MemoryMask);
	}


	this.saveSequence = function () {
		// Save sequencer to MC-8 memory
		this.saveSequenceData();

		// Save MC-8 memory to data chunks ready for bitstream output
		var dataBytes = new Array();

		// Write song blocks
		this.saveMC8MemoryBlocks(MC8SongConfig & MC8MemoryMask, _MC8SongSize, dataBytes);

		// Write data blocks
		this.saveMC8MemoryBlocks(MC8DataStart & MC8MemoryMask, _MC8DataSize, dataBytes);

		// Write no more data
		dataBytes.push(0);

		// Display encoded
		$(config.logViewId).append('Bytes: ' + dataBytes.join(', ') + "<br/>\n");

		// Encode bytes to bitstream
		var enc = new MC8BitStreamEncoder();
		enc.BitStreamEncode(dataBytes);

		$(config.logViewId).append('Bits: ' + enc.Encoded + "<br/>\n");

		// TODO: Playback bitstream as audio
		enc.PlayAudioData();
	}

	/////////////////////////////
	// Load sequencer memory
	/////////////////////////////

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

		this.displayTransport();

		// Display channel data
		for (var i = 0; i < _channels.length; i++) {
			_channels[i].displayNotes();
		}
	}

	/////////////////////////////
	// Display Transport
	/////////////////////////////

	this.createTransportTemplate = function () {
		var row = '<tr><td>---</td><td>---</td></tr>';
		var html = '<table id="transport" class="channel">';
		html += '<caption>Transport</caption>';
		html += '<thead><tr><th>Mes.</th><th>Step</th></tr></thead>';

		html += '<tbody class="NotesBeforeEdit">';
		for (var i = 0; i < config.rowsBeforeEdit; i++)
		{ html += row; }
		html += '</tbody>';

		html += '<tbody class="NotesEdit">';
		html += row
		html += '</tbody>';

		html += '<tbody class="NotesAfterEdit">';
		for (var i = 0; i < config.rowsAfterEdit; i++)
		{ html += row; }
		html += '</tbody>';

		html += '</table>';

		return html;
	}

	this.displayTransportRow = function (step, tr, measureSize) {
		if (0 > step) {
			tr.cells[0].innerHTML = '&nbsp;';
			tr.cells[1].innerHTML = '&nbsp;';
			return;
		}

		if (0 != (step % measureSize)) {
			tr.cells[0].innerHTML = '&nbsp;';
		}
		else {
			tr.cells[0].innerHTML = Math.floor(step / measureSize);
		}
		tr.cells[1].innerHTML = (step % measureSize).toString();
	}

	this.displayTransport = function () {
		var step;
		// Exit if no timebase
		if (0 == _timeBase) {
			return;
		}

		// Measure size in 4/4 is 4*timebase
		var measureSize = _timeBase * 4;

		// First display current step
		this.displayTransportRow(_currentStep, _transportEdit, measureSize);

		// display steps affter
		step = _currentStep + 1;
		for (var i = 0; i < config.rowsAfterEdit; i++) {
			this.displayTransportRow(step++, _transportAfterEdit[i], measureSize);
		}

		// display steps before
		step = _currentStep - config.rowsBeforeEdit;
		for (var i = 0; i < config.rowsBeforeEdit; i++) {
			this.displayTransportRow(step++, _transportBeforeEdit[i], measureSize);
		}
	}

	/////////////////////////////
	// Init
	/////////////////////////////

	// Init and attach
	this.initSequencer = function () {

		// Get Container ref
		_channelContainer = $(config.channelContainerId);

		// Create transport
		_channelContainer.append(this.createTransportTemplate());
		_transportUI = $('#transport', _channelContainer);
		_transportEdit = $('tbody.NotesEdit > tr', _transportUI)[0];
		_transportAfterEdit = $('tbody.NotesAfterEdit > tr', _transportUI);
		_transportBeforeEdit = $('tbody.NotesBeforeEdit > tr', _transportUI);

		// Mouse wheel only on transport area
		_transportUI.mousewheel(function (event, delta, deltaX, deltaY) {
			_sequencer.editHandleMouseWheel(delta);
		});

		// Create empty channels
		_channels = new Array();
		for (var i = 0; i < 8; i++) {
			var chn = new MC8TrackerChannel(i, config.rowsBeforeEdit, config.rowsAfterEdit);
			chn.config.editStepUpDownCallback = function (direction) {
				_sequencer.editStepUpDown(direction);
			};
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

		// btn Sequencer Advance
		$(config.btnSeqAdvance).click(function () {
			_sequencer.sequencerStep();
		});

		// btn Play/Pause
		$(config.btnPlayPauseId).click(function () {
			_sequencer.playPauseSequencer();
		});

		// btn Stop
		$(config.btnStopId).click(function () {
			_sequencer.stopSequencer();
		});

		// btn Save
		$(config.btnSave).click(function () {
			_sequencer.saveSequence();
		});
	};

	// Return entire object
	return this;
} ();