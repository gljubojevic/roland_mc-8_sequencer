using System;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	/// <summary>
	/// Class to decode MC-8 tape output
	/// Tape output uses two frequencies
	/// 2100Hz - For "1" - 7 full periods (14 half periods) 3.333 ms
	/// 1300Hz - For "0" - 4 full periods (8 half periods) 3.076 ms
	/// From tape first bits received are from LSB to MSB
	/// Each byte is spearated with 3 bits, same three bits mark data start
	/// 2 bit "1"
	/// 1 bit "0"
	/// Total of three bits "110"
	/// </summary>
	public class MC8BitStreamDecoder
	{
		public const int HIFreqHz = 2100;
		public const int LOFreqHz = 1300;
		public const int LogicOneHIFreqPeriods = 7;
		public const int LogicZeroLOFreqPeriods = 4;

		private FrequencyData _freqData;
		private int _freqLast;
		private bool _dataStarted;

		private int _bitNo;
		private BitData _currentBit;

		public List<BitData> DecodedData;
		public string Decoded;
	
		public float LoFreqTolerance { get; set; }
		public float HiFreqTolerance { get; set; }

		private int _maxHiPeriods;
		private int _maxLoPeriods;

		public MC8BitStreamDecoder()
		{
			this.LoFreqTolerance = 0.2f;
			this.HiFreqTolerance = 0.1f;

			this.Start(false);
		}

		private bool CheckFreq(int freq, int val, float tolerance)
		{
			return Math.Abs(freq - val) < tolerance * freq;
		}

		private void DecodeOne()
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

		private void DecodeZero()
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

		public void Start(bool freqDetectOnHalfPeriod)
		{
			this._maxHiPeriods = freqDetectOnHalfPeriod ? LogicOneHIFreqPeriods * 2 : LogicOneHIFreqPeriods;
			this._maxLoPeriods = freqDetectOnHalfPeriod ? LogicZeroLOFreqPeriods * 2 : LogicZeroLOFreqPeriods;

			this.DecodedData = new List<BitData>();
			this.Decoded = string.Empty;

			this._bitNo = 0;
			this._currentBit = new BitData(this._bitNo);

			this._dataStarted = false;
			this._freqLast = 0;
		}

		public bool Decode(FrequencyData freqData)
		{
			// Store current frequency for detection
			this._freqData = freqData;

			// Detect correct frequency with tollerance
			int freq = this._freqData.Frequency;
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
				this._currentBit.AllFrequencyData.Add(this._freqData);
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
				if (this._currentBit.Count > 0)
				{
					this.DecodedData.Add(this._currentBit);
					this._currentBit = new BitData(this._bitNo);
				}
			}

			// Try to decode bits
			this.DecodeOne();
			this.DecodeZero();

			this._currentBit.Freq = this._freqData.Frequency;
			this._currentBit.FreqDetected = freq;
			this._currentBit.AllFrequencyData.Add(this._freqData);

			return true;
		}

	}
}
