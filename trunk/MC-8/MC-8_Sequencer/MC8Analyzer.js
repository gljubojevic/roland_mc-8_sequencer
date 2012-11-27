﻿/// <reference path="MC8BitStreamDecoder.js" />
/// <reference path="MC8FrequencyDecoder.js" />
/// <reference path="MC8Sequencer.js" />
/// <reference path="MC8Tracker.js" />

// http: //airtightinteractive.com/demos/js/reactive/
// http: //uglyhack.appspot.com/webaudiotoy/

// Declare and make instance of analyzer object
var MC8Analyzer = function () {
	// Self ref
	var _analyzer = this;

	// Config
	var config = {
		logViewId: '#AnalyzeLog',
		inputFileId: '#FileLoadMC8Data',
		btnLoadFromWaveId: '#btnLoadFromWave',
		btnLoadDemoId: '#btnLoadDemo',
		btnPlayWaveId: '#btnAnalyzerPlayWave',
		btnDumpBitsId: '#btnAnalyzerDumpBits',
		btnDumpBytesId: '#btnAnalyzerDumpBytes',
		btnDumpBitsAndBytesId: '#btnAnalyzerDumpBitsAndBytes',
		selLoFreqToleranceId: '#loFreqTolerance',
		selHiFreqToleranceId: '#hiFreqTolerance',
		callbackLoadSequence: null,
		loFreqTolerance: 10,
		hiFreqTolerance: 25
	};

	var audioContext = null; 	// Create Audio Context
	var bufferSource = null;	// Create buffer source;

	// Store reference to sequence bytes here
	this.SequencerBits = null;
	this.SequencerBytes = null;
	this.SequencerBitsAndBytes = null;

	this.log = function () {
		$(config.logViewId).append([].slice.call(arguments) + "<br/>\n");
		//console.log('MC8Analyzer',[].slice.call(arguments));
	};

	this.logClear = function () {
		$(config.logViewId).empty();
	};

	//	this.createAudio = function()
	//	{
	//		processor = audioContext.createJavaScriptNode(2048, 1, 1);
	//		analyser = audioContext.createAnalyser();

	//		bufferSource.connect(audioContext.destination);
	//		bufferSource.connect(analyser);

	//		analyser.connect(processor);
	//		processor.connect(audioContext.destination);

	//		bufferSource.noteOn(0);
	//	};


	/////////////////////////////
	// Analyze
	/////////////////////////////

	// Analyze wave
	this.analyzeAudioBuffer = function () {
		freqDec = new MC8FrequencyDecoder();
		freqDec.frequencyDetect(bufferSource.buffer.getChannelData(0), bufferSource.buffer.sampleRate);
		//this.log("No Freq detected:" + freqDec._frequencyData.length);

		bitStreamDec = new MC8BitStreamDecoder();
		bitStreamDec.LoFreqTolerance = config.loFreqTolerance / 100.0;
		bitStreamDec.HiFreqTolerance = config.hiFreqTolerance / 100.0;
		this.SequencerBits = bitStreamDec.BitStreamDecode(freqDec._frequencyData);

		this.SequencerBytes = bitStreamDec.BitStreamToBytes();
		this.SequencerBitsAndBytes = bitStreamDec.DecodedBytesData;

		this.enableUIDumpCmd();
	};

	// Display bitstream
	this.dumpBitStream = function () {
		this.log("BitStream:\n" + this.SequencerBits);
	}

	// Display Bytes
	this.dumpBytes = function () {
		this.log("Bytes:\n" + this.SequencerBytes.join(', '));
	}

	// Display bits and bytes 
	this.dumpBitsAndBytes = function () {
		for (var i = 0; i < this.SequencerBitsAndBytes.length; i++) {
			this.log(i, this.SequencerBitsAndBytes[i].bits, this.SequencerBitsAndBytes[i].val);
		}
	}

	/////////////////////////////
	// Extras
	/////////////////////////////

	// Just for playback of audio source
	this.playAudioBuffer = function () {
		//bufferSource.noteOff();
		bufferSource.noteOn(0);
	};

	this.enableUICmd = function () {
		$(config.btnLoadFromWaveId).prop('disabled', false);
		$(config.btnPlayWaveId).prop('disabled', false);
		_analyzer.log("Wave loaded");
	}

	this.enableUIDumpCmd = function () {
		$(config.btnDumpBitsId).prop('disabled', false);
		$(config.btnDumpBytesId).prop('disabled', false);
		$(config.btnDumpBitsAndBytesId).prop('disabled', false);
	}

	/////////////////////////////
	// Load
	/////////////////////////////

	// When Wave is loaded set buffer objects
	this.callbackAudioLoaded = function (evt) {
		// Check if really loaded
		if (evt.target.readyState != FileReader.DONE) {
			this.Log("Error wave not loaded!");
			return;
		}

		if (audioContext.decodeAudioData) {
			audioContext.decodeAudioData(
				evt.target.result,
				function (buffer) {
					bufferSource.buffer = buffer;
					bufferSource.connect(audioContext.destination);
					_analyzer.enableUICmd();
				},
				function (e) {
					_analyzer.log("cannot decode mp3", e);
				}
			);
		}
		else {
			bufferSource.buffer = audioContext.createBuffer(evt.target.result, false);
			_analyzer.enableUICmd();
		}
	}

	this.loadFromUrl = function (url) {
		// Load asynchronously
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";
		request.onload = function () {
			bufferSource.buffer = audioContext.createBuffer(request.response, false);
			_analyzer.enableUICmd();
		};

		request.send();
	}


	this.callbackLoadProgram = function (file) {
		var reader = new FileReader();
		reader.onload = this.callbackAudioLoaded;
		reader.readAsArrayBuffer(file);

		//		reader.onloadend = function (evt)
		//		{
		//			if (evt.target.readyState == FileReader.DONE)
		//			{	$(audioContainerId).append('<audio src="' + evt.target.result + '" controls></audio>');		}
		//		};
		//		reader.readAsDataURL(file);
	};

	/////////////////////////////
	// Init
	/////////////////////////////

	// Init and attach
	this.initAnalyzer = function (callbackLoadSequence, AudioContext) {
		// Set Global Audio context
		audioContext = AudioContext;

		// Create buffer source;
		bufferSource = audioContext.createBufferSource();

		// Set callback
		config.callbackLoadSequence = callbackLoadSequence;

		//File
		$(config.inputFileId).change(function () {
			_analyzer.callbackLoadProgram(this.files[0]);
		});

		// Load demo
		$(config.btnLoadDemoId).click(function () {
			_analyzer.loadFromUrl('test_bach-mc8-data.wav');
		});

		// btn Load from Wave
		$(config.btnLoadFromWaveId).click(function () {
			// Call this in context of analyzer
			_analyzer.analyzeAudioBuffer.call(_analyzer);
			// Load in sequencer
			if (null != config.callbackLoadSequence) {
				config.callbackLoadSequence(_analyzer.SequencerBytes);
			}
		});

		// btn Play
		$(config.btnPlayWaveId).click(function () {
			_analyzer.playAudioBuffer();
		});

		// btn dump bits
		$(config.btnDumpBitsId).click(function () {
			_analyzer.dumpBitStream();
		});

		// btn dump bytes
		$(config.btnDumpBytesId).click(function () {
			_analyzer.dumpBytes();
		});

		// btn dump bits and bytes
		$(config.btnDumpBitsAndBytesId).click(function () {
			_analyzer.dumpBitsAndBytes();
		});

		// Freq Tolerance
		var loFreq = $(config.selLoFreqToleranceId);
		var hiFreq = $(config.selHiFreqToleranceId);
		loFreq.empty();
		hiFreq.empty();

		for (var i = 0; i < 55; i += 5) {
			var opt = '<option value="' + i + '">' + i + '%</option>';
			loFreq.append(opt);
			hiFreq.append(opt);
		}

		$('option[value=' + config.loFreqTolerance + ']', loFreq).prop('selected', true);
		$('option[value=' + config.hiFreqTolerance + ']', hiFreq).prop('selected', true);

		loFreq.change(function () {
			config.loFreqTolerance = parseInt($(this).val());
		});
		hiFreq.change(function () {
			config.hiFreqTolerance = parseInt($(this).val());
		});
	};

	// Return entire object
	return this;
} ();
