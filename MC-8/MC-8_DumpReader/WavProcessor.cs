using System;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	public class WavProcessor
	{
		public int SampleRate;

		public WavProcessor()
		{
			// Set default sample rate to 44100hz
			this.SampleRate = 44100;

			// Set default treshold
			this.Threshold = 0.3f;

			// Set default normalize factor
			this.NormalizeFactor = 1.0f;
		}


		#region Quadratic filter

		private float _threshold;
		public float Threshold
		{
			get { return this._threshold; }
			set
			{
				this._threshold = value;
				this._hiThresholdVal = (short)Math.Round(short.MaxValue * this._threshold);
				this._loThresholdVal = (short)Math.Round(short.MinValue * this._threshold);
			}
		}

		private short _hiThresholdVal;
		private short _loThresholdVal;

		public short QuadraticFilter(short val)
		{
			if (val > 0)
			{
				if (val < this._hiThresholdVal)
				{ return 0; }
				else
				{ return short.MaxValue; }
			}
			else if (val < 0)
			{
				if (val > this._loThresholdVal)
				{ return 0; }
				else
				{ return short.MinValue; }
			}

			return val;
		}

		#endregion

		#region Normalize

		public float NormalizeFactor { get; set; }

		public short NormalizeFilter(short val)
		{
			return (short)Math.Round(val * this.NormalizeFactor);
		}

		public void FindNormalizeFactor(short[] data)
		{
			short tmp;
			short max = Math.Abs(data[0]);

			for (int i = 1; i < data.Length; i++)
			{
				try
				{
					tmp = Math.Abs(short.MinValue == data[i] ? short.MaxValue : data[i]);
					if (tmp > max)
					{ max = tmp; }
				}
				catch (Exception ex)
				{
					throw new ApplicationException(string.Format("{0}: 0x{1:x4} -> {1}", i, data[i]), ex);
				}
			}

			this.NormalizeFactor = (float)short.MaxValue / max;
		}

		#endregion

		#region Frequency detection

		public FrequencyData FreqDetected;
		private int _freqDetectHiPeriod;
		private int _freqDetectLoPeriod;
		private int _freqDetectLastVal;

		/// <summary>
		/// Initialize frequency detection
		/// </summary>
		/// <param name="sampleRate">sample rate of samples fed to frequency detection</param>
		public void SimpleFreqDetectionReset(int sampleRate)
		{
			this._freqDetectLastVal = 0;
			this._freqDetectHiPeriod = 0;
			this._freqDetectLoPeriod = 0;
			this.SampleRate = sampleRate;
		}

		/// <summary>
		/// Simple frequency detection routine that starts with HI period
		/// </summary>
		/// <param name="val">Sample value</param>
		/// <param name="samplePos">current sample position</param>
		/// <returns>true when frequency is detected</returns>
		/// <remarks>
		/// Hi period is all values >=0
		/// Lo period is all values < 0
		/// </remarks>
		public bool SimpleFreqDetectionOnHi(short val, int samplePos)
		{
			bool detected = false;

			if (val >= 0)
			{
				if (this._freqDetectLastVal < 0 && (this._freqDetectHiPeriod + this._freqDetectLoPeriod) > 0)
				{
					detected = true;
					this.FreqDetected = new FrequencyData(this.SampleRate, samplePos, this._freqDetectHiPeriod, this._freqDetectLoPeriod);
					this._freqDetectHiPeriod = 0;
					this._freqDetectLoPeriod = 0;
				}
				this._freqDetectHiPeriod++;
			}
			else
			{ this._freqDetectLoPeriod++; }

			// Store this value as last value
			this._freqDetectLastVal = val;

			return detected;
		}

		/// <summary>
		/// Simple frequency detection routine that starts with LO period
		/// </summary>
		/// <param name="val">Sample value</param>
		/// <param name="samplePos">current sample position</param>
		/// <returns>true when frequency is detected</returns>
		/// <remarks>
		/// Hi period is all values >=0
		/// Lo period is all values < 0
		/// </remarks>
		public bool SimpleFreqDetectionOnLo(short val, int samplePos)
		{
			bool detected = false;

			if (val >= 0)
			{	this._freqDetectHiPeriod++;	}
			else
			{
				if (this._freqDetectLastVal >= 0 && (this._freqDetectHiPeriod + this._freqDetectLoPeriod) >  0)
				{
					detected = true;
					this.FreqDetected = new FrequencyData(this.SampleRate, samplePos, this._freqDetectHiPeriod, this._freqDetectLoPeriod);
					this._freqDetectHiPeriod = 0;
					this._freqDetectLoPeriod = 0;
				}
				this._freqDetectLoPeriod++;
			}

			// Store this value as last value
			this._freqDetectLastVal = val;

			return detected;
		}

		/// <summary>
		/// Detects frequency on half period
		/// </summary>
		/// <param name="val">Sample value</param>
		/// <param name="samplePos">current sample position</param>
		/// <returns>true when frequency is detected, either half period is detected</returns>
		/// <remarks>
		/// Hi period is all values >=0
		/// Lo period is all values < 0
		/// </remarks>
		public bool SimpleFreqDetection(short val, int samplePos)
		{
			bool detected = false;

			if (val >= 0)
			{
				if (this._freqDetectLastVal < 0)
				{
					detected = true;
					this.FreqDetected = new FrequencyData(this.SampleRate, samplePos, 0, this._freqDetectLoPeriod);
					this._freqDetectHiPeriod = 0;
					this._freqDetectLoPeriod = 0;
				}

				this._freqDetectHiPeriod++;
			}
			else
			{
				if (this._freqDetectLastVal >= 0)
				{
					detected = true;
					this.FreqDetected = new FrequencyData(this.SampleRate, samplePos, _freqDetectHiPeriod, 0);
					this._freqDetectHiPeriod = 0;
					this._freqDetectLoPeriod = 0;
				}

				this._freqDetectLoPeriod++;
			}

			// Store this value as last value
			this._freqDetectLastVal = val;

			return detected;
		}

		#endregion
	}
}
