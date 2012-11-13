/// <reference path="MC8BitStreamDecoder.js" />
/// <reference path="MC8FrequencyDecoder.js" />

// http: //airtightinteractive.com/demos/js/reactive/
// http: //uglyhack.appspot.com/webaudiotoy/

// Declare and make instance of analyzer object
var MC8Analyzer = function ()
{
	// Self ref
	var _analyzer = this;

	// Config
	var config = {
		logViewId: '#AnalyzeLog',
		inputFileId: '#FileLoadMC8Data',
		btnPlayWaveId: '#btnAnalyzerPlayWave',
		btnAnalyzeId: '#btnAnalyze',
		btnClearLogId: '#btnClearLog',
		selLoFreqToleranceId: '#loFreqTolerance',
		selHiFreqToleranceId: '#hiFreqTolerance',
		audioContainerId: '#MC8ProgramDataAudio',
		loFreqTolerance: 10,
		hiFreqTolerance: 25
	};

	var audioContext = new window.webkitAudioContext(); 	// Create Audio Context
	var bufferSource = audioContext.createBufferSource(); // Create buffer source;

	// Store reference to sequence bytes here
	this.SequencerBytes = null;

	this.log = function ()
	{
		$(config.logViewId).append([].slice.call(arguments) + "<br/>\n")
		//console.log('MC8Analyzer',[].slice.call(arguments));
	};

	this.logClear = function ()
	{
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
	this.analyzeAudioBuffer = function ()
	{
		freqDec = new MC8FrequencyDecoder();
		freqDec.frequencyDetect(bufferSource.buffer.getChannelData(0), bufferSource.buffer.sampleRate);
		this.log("No Freq detected:" + freqDec._frequencyData.length);

		bitStreamDec = new MC8BitStreamDecoder();
		bitStreamDec.LoFreqTolerance = config.loFreqTolerance / 100.0;
		bitStreamDec.HiFreqTolerance = config.hiFreqTolerance / 100.0;
		bitStream = bitStreamDec.BitStreamDecode(freqDec._frequencyData);
		this.log("BitStream:\n" + bitStream);

		this.SequencerBytes = bitStreamDec.BitStreamToBytes();
		this.log("Bytes:\n" + this.SequencerBytes.join(', '));
		// Display bytes and bits
		for (var i = 0; i < bitStreamDec.DecodedBytesData.length; i++) {
			this.log(i, bitStreamDec.DecodedBytesData[i].bits, bitStreamDec.DecodedBytesData[i].val);
		}
	};

	/////////////////////////////
	// Extras
	/////////////////////////////

	// Just for playback of audio source
	this.playAudioBuffer = function ()
	{
		//bufferSource.noteOff();
		bufferSource.noteOn(0);
	};

	/////////////////////////////
	// Load
	/////////////////////////////

	// When Wave is loaded set buffer objects
	this.callbackAudioLoaded = function (evt)
	{
		// Check if really loaded
		if (evt.target.readyState != FileReader.DONE)
		{
			this.Log("Error wave not loaded!");
			return;
		}

		if (audioContext.decodeAudioData)
		{
			audioContext.decodeAudioData(
				evt.target.result,
				function (buffer)
				{
					bufferSource.buffer = buffer;
					bufferSource.connect(audioContext.destination);
					$(config.btnAnalyzeId).prop('disabled', false);
					$(config.btnPlayWaveId).prop('disabled', false);
					_analyzer.log("Wave loaded");
				},
				function (e)
				{
					_analyzer.log("cannot decode mp3", e);
				}
			);
		}
		else
		{
			bufferSource.buffer = audioContext.createBuffer(evt.target.result, false);
			$(config.btnAnalyzeId).prop('disabled', false);
			$(config.btnPlayWaveId).prop('disabled', false);
			_analyzer.log("Wave loaded");
		}
	}

	this.callbackLoadProgram = function (file)
	{
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
	this.initAnalyzer = function ()
	{
		//File
		$(config.inputFileId).change(function ()
		{
			_analyzer.callbackLoadProgram(this.files[0]);
		});

		// btn Play
		$(config.btnPlayWaveId).click(function ()
		{
			_analyzer.playAudioBuffer();
		});

		// btn Analyze
		$(config.btnAnalyzeId).click(function ()
		{
			_analyzer.analyzeAudioBuffer.call(_analyzer);
			//_analyzer.analyzeAudioBuffer();
		});

		// btn log clear
		$(config.btnClearLogId).click(function ()
		{
			_analyzer.logClear();
		});

		// Freq Tolerance
		var loFreq = $(config.selLoFreqToleranceId);
		var hiFreq = $(config.selHiFreqToleranceId);
		loFreq.empty();
		hiFreq.empty();

		for (var i = 0; i < 55; i += 5)
		{
			var opt = '<option value="' + i + '">' + i + '</option>';
			loFreq.append(opt);
			hiFreq.append(opt);
		}

		$('option[value=' + config.loFreqTolerance + ']', loFreq).prop('selected', true);
		$('option[value=' + config.hiFreqTolerance + ']', hiFreq).prop('selected', true);

		loFreq.change(function ()
		{
			config.loFreqTolerance = parseInt($(this).val());
		});
		hiFreq.change(function ()
		{
			config.hiFreqTolerance = parseInt($(this).val());
		});
	};

	// Return entire object
	return this;
}();
