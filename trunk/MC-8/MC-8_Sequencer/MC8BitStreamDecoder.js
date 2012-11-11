// Class to keep bitstream data
function BitData(bitNo)
{
	this.BitNo=bitNo;
	this.Value=-1;
	this.Freq = 0;
	this.FreqDetected = 0;
	this.AllFrequencyData = new Array();

	this.FirstSample = function()
	{
		return this.AllFrequencyData[0].FirstSample;
	}

	this.LastSample = function()
	{
		return this.AllFrequencyData[this.AllFrequencyData.length - 1].LastSample;
	}

	this.Count = function()
	{
		return this.AllFrequencyData.length;
	}
}


// Decode frequency to bitstrem
function MC8BitStreamDecoder()
{
	// Constants
	var HIFreqHz = 2100;
	var LOFreqHz = 1300;
	var LogicOneHIFreqPeriods = 7;
	var LogicZeroLOFreqPeriods = 4;

	// Member variables
	this._freqData = null;
	this._freqLast = null;
	this._dataStarted = false;

	this._bitNo = 0;
	this._currentBit = null;

	this.DecodedData = null;
	this.Decoded = '';
	
	this.LoFreqTolerance = 0.1;
	this.HiFreqTolerance = 0.2;

	var _maxHiPeriods;
	var _maxLoPeriods;

	this.CheckFreq = function(freq, val, tolerance)
	{
		return Math.abs(freq - val) < tolerance * freq;
	}

	this.DecodeOne = function()
	{
		if (this._freqLast == HIFreqHz && this._currentBit.Count == _maxHiPeriods)
		{
			this.Decoded += '1';
			this._currentBit.Value = 1;
			this.DecodedData.push(this._currentBit);

			this._bitNo++;
			this._currentBit = new BitData(this._bitNo);
		}
	}

	this.DecodeZero = function()
	{
		if (this._freqLast == LOFreqHz && this._currentBit.Count == _maxLoPeriods)
		{
			this.Decoded += '0';
			this._currentBit.Value = 0;
			this.DecodedData.push(this._currentBit);

			this._bitNo++;
			this._currentBit = new BitData(this._bitNo);
		}
	}

	this.Start = function()
	{
		// Work with half periods
		_maxHiPeriods = LogicOneHIFreqPeriods * 2;
		_maxLoPeriods = LogicZeroLOFreqPeriods * 2;

		this.DecodedData = new Array();
		this.Decoded = '';

		this._bitNo = 0;
		this._currentBit = new BitData(this._bitNo);

		this._dataStarted = false;
		this._freqLast = 0;
	}

	this.Decode = function(freqData)
	{
		// Store current frequency for detection
		this._freqData = freqData;

		// Detect correct frequency with tollerance
		freq = this._freqData.Frequency;
		if (this.CheckFreq(HIFreqHz, freq, this.HiFreqTolerance))
		{ freq = HIFreqHz; }
		else if (this.CheckFreq(LOFreqHz, freq, this.LoFreqTolerance))
		{ freq = LOFreqHz; }
		else
		{
			// Decode previous bits if possible
			this.DecodeOne();
			this.DecodeZero();

			// Add Error freq to bit stream data also
			this._currentBit.Freq = this._freqData.Frequency;
			this._currentBit.FreqDetected = 0;
			this._currentBit.AllFrequencyData.push(this._freqData);
			return false;
		}

		// Check if data stream started
		if (!this._dataStarted)
		{
			// Data starts with LOFreq
			if (freq != LOFreqHz)
			{ return true; }

			this._dataStarted = true;
		}

		// Check if frequency changed
		if (freq != this._freqLast)
		{
			// Decode previous bits if possible
			this.DecodeOne();
			this.DecodeZero();

			// Set new frequency as default 
			this._freqLast = freq;

			// Add bad frequency bits anyway
			if (this._currentBit.Count() > 0)
			{
				this.DecodedData.push(this._currentBit);
				this._currentBit = new BitData(this._bitNo);
			}
		}

		// Try to decode bits
		this.DecodeOne();
		this.DecodeZero();

		this._currentBit.Freq = this._freqData.Frequency;
		this._currentBit.FreqDetected = freq;
		this._currentBit.AllFrequencyData.push(this._freqData);

		return true;
	}
}