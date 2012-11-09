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
		if (this._freqLast == HIFreqHz && this._currentBit.Count == this._maxHiPeriods)
		{
			this.Decoded += '1';
			this._currentBit.Value = 1;
			this.DecodedData.Add(this._currentBit);

			this._bitNo++;
			this._currentBit = new BitData(this._bitNo);
		}
	}

	this.DecodeZero = function()
	{
		if (this._freqLast == LOFreqHz && this._currentBit.Count == this._maxLoPeriods)
		{
			this.Decoded += '0';
			this._currentBit.Value = 0;
			this.DecodedData.Add(this._currentBit);

			this._bitNo++;
			this._currentBit = new BitData(this._bitNo);
		}
	}

}