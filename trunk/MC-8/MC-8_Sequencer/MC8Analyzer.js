// http: //airtightinteractive.com/demos/js/reactive/
// http: //uglyhack.appspot.com/webaudiotoy/

// Frequency data object
function MC8FrequencyData(sampleRate, lastSample, hiPeriod, loPeriod)
{
	this.rowNo = 0;
	this.sampleRate = sampleRate;
	this.lastSample = lastSample;
	this.hiPeriod = hiPeriod;
	this.loPeriod = loPeriod;

	this.firstSample = function() {
		return this.lastSample - (this.hiPeriod + this.loPeriod);
	};

	this.frequency = function() {
		// Check detected on half period
		if (0 == this.hiPeriod || 0 == this.loPeriod)
		{ return Math.round(this.sampleRate / (this.hiPeriod + this.loPeriod) / 2); }
		else
		{ return Math.round(this.sampleRate / (this.hiPeriod + this.loPeriod)); }
	};
};


// Declare and make instance of analyzer object
var MC8Analyzer = function ()
{
	// Self ref
	var _analyzer = this;

	// Config
	var config = {
		logViewId: null,
		inputFileId: null,
		btnPlayWaveId: null,
		btnAnalyzeId: null,
		btnClearLogId: null,
		selLoFreqToleranceId: null,
		selHiFreqToleranceId: null,
		audioContainerId: null,
		frequencyContainerId: null,
		bitstreamContainerId: null,
		loFreqTolerance: 10,
		hiFreqTolerance: 20
	};

	var audioContext = new window.webkitAudioContext(); 	// Create Audio Context
	var bufferSource = audioContext.createBufferSource(); // Create buffer source;

	this.log = function ()
	{
		$(config.logViewId).append([].slice.call(arguments) + "\n")
		console.log(
			'MC8Analyzer',
			[].slice.call(arguments)
		);
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
	// Normalize
	/////////////////////////////
	var _normalizeFactor = 1.0;

	this.findNormalizeFactor = function (data)
	{
		var tmp;
		var max = Math.abs(data[0]);

		for (var i = 1; i < data.length; i++)
		{
			tmp = Math.abs(data[i]);
			if (tmp > max)
			{ max = tmp; }
		}

		_normalizeFactor = 1.0 / max;
	};

	this.normalizeFilter = function (val)
	{
		return val * _normalizeFactor;
	};

	/////////////////////////////
	// Quad filter
	/////////////////////////////

	var _quadFilterHiThreshold = 0;
	var _quadFilterLoThreshold = 0;

	this.setQuadFilterTreshold = function (treshold)
	{
		_quadFilterHiThreshold = 1.0 * treshold;
		_quadFilterLoThreshold = -1.0 * treshold;
	}

	this.quadraticFilter = function (val)
	{
		if (val > 0)
		{
			if (val < _quadFilterHiThreshold)
			{ return 0; }
			else
			{ return 1.0; }
		}
		else if (val < 0)
		{
			if (val > _quadFilterLoThreshold)
			{ return 0; }
			else
			{ return -1; }
		}

		return val;
	}

	/////////////////////////////
	// Frequency detection
	/////////////////////////////
	var _frequencyData;

	var _freqDetectHiPeriod;
	var _freqDetectLoPeriod;
	var _freqDetectLastVal;
	var _freqDetectSampleRate;

	this.simpleFreqDetection = function (val, pos)
	{
		detected = null;

		if (val >= 0)
		{
			if (_freqDetectLastVal < 0)
			{
				detected = new MC8FrequencyData(_freqDetectSampleRate, pos, 0, _freqDetectLoPeriod);
				_freqDetectHiPeriod = 0;
				_freqDetectLoPeriod = 0;
			}

			_freqDetectHiPeriod++;
		}
		else
		{
			if (_freqDetectLastVal >= 0)
			{
				detected = new MC8FrequencyData(_freqDetectSampleRate, pos, _freqDetectHiPeriod, 0);
				_freqDetectHiPeriod = 0;
				_freqDetectLoPeriod = 0;
			}

			_freqDetectLoPeriod++;
		}

		// Store this value as last value
		_freqDetectLastVal = val;

		return detected;
	};

	this.frequencyDisplay = function ()
	{
		// Display Frequencies
		var freqTableBody = '';
		for (var i = 0; i < _frequencyData.length; i++)
		{
			freqTableBody += '<tr>'
				+ '<td>' + _frequencyData[i].rowNo + '</td>'
				+ '<td>' + _frequencyData[i].frequency() + '</td>'
				+ '<td>' + _frequencyData[i].firstSample() + '</td>'
				+ '<td>' + _frequencyData[i].lastSample + '</td>'
				+ '<td>' + _frequencyData[i].hiPeriod + '</td>'
				+ '<td>' + _frequencyData[i].loPeriod + '</td>'
				+ '</tr>'
		}
		$(config.frequencyContainerId + ' > table > tbody').empty();
		$(config.frequencyContainerId + ' > table > tbody').append(freqTableBody);
	};

	this.frequencyDetect = function ()
	{
		var data = bufferSource.buffer.getChannelData(0);

		this.findNormalizeFactor(data);

		// Get All frequencies
		_frequencyData = new Array();
		_freqDetectLastVal = 0;
		_freqDetectHiPeriod = 0;
		_freqDetectLoPeriod = 0;
		_freqDetectSampleRate = bufferSource.buffer.sampleRate;
		for (var i = 0; i < data.length; i++)
		{
			var val = this.normalizeFilter(data[i]);
			val = this.quadraticFilter(val);

			var freq = this.simpleFreqDetection(val, i);
			if (null != freq)
			{
				freq.rowNo = _frequencyData.length;
				_frequencyData.push(freq);
			}
		}
		this.log("Freq detected:" + _frequencyData.length);

		// Slooooow
		//this.frequencyDisplay();
	}

	/////////////////////////////
	// BitStream decode
	/////////////////////////////


	/////////////////////////////
	// Analyze
	/////////////////////////////

	// Analyze wave
	this.analyzeAudioBuffer = function ()
	{
		this.frequencyDetect();
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
			config.loFreqTolerance = $(this).val();
		});
		hiFreq.change(function ()
		{
			config.hiFreqTolerance = $(this).val();
		});
	};

	//////////////////////////////////
	// Public Object Interface
	//////////////////////////////////

	// Public Methods/Variables
	// All Public Methods and Variables are exported as public
	return {
		config: config,
		initAnalyzer: initAnalyzer
	};
} ();
