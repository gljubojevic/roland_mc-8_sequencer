// Frequency data object
function MC8FrequencyData(sampleRate, lastSample, hiPeriod, loPeriod)
{
	this.rowNo = 0;
	this.sampleRate = sampleRate;
	this.lastSample = lastSample;
	this.hiPeriod = hiPeriod;
	this.loPeriod = loPeriod;

	this.firstSample = function ()
	{
		return this.lastSample - (this.hiPeriod + this.loPeriod);
	};

	this.frequency = function ()
	{
		// Check detected on half period
		if (0 == this.hiPeriod || 0 == this.loPeriod)
		{ return Math.round(this.sampleRate / (this.hiPeriod + this.loPeriod) / 2); }
		else
		{ return Math.round(this.sampleRate / (this.hiPeriod + this.loPeriod)); }
	};
};


// Decode frequency from raw sample data
function MC8FrequencyDecoder()
{
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
	this._frequencyData = null;

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


	this.frequencyDetect = function (data, sampleRate)
	{
		// Get All frequencies
		this._frequencyData = new Array();
		_freqDetectLastVal = 0;
		_freqDetectHiPeriod = 0;
		_freqDetectLoPeriod = 0;
		_freqDetectSampleRate = sampleRate;

		this.findNormalizeFactor(data);

		for (var i = 0; i < data.length; i++)
		{
			var val = this.normalizeFilter(data[i]);
			val = this.quadraticFilter(val);

			var freq = this.simpleFreqDetection(val, i);
			if (null != freq)
			{
				freq.rowNo = this._frequencyData.length;
				this._frequencyData.push(freq);
			}
		}
	};
}