using System;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	/// <summary>
	/// Class for keeping frequency detection data
	/// </summary>
	public class FrequencyData
	{
		public int RowNo { get; set; }
		public int SampleRate { get; set; }
		public int LastSample { get; set; }
		public int FirstSample
		{
			get { return this.LastSample - (this.HiPeriodSamples + this.LoPeriodSamples); }
		}
		public int HiPeriodSamples { get; set; }
		public int LoPeriodSamples { get; set; }

		public int Frequency
		{
			get
			{
				if (0 == this.HiPeriodSamples || 0 == this.LoPeriodSamples)
				{
					// Detected on half period
					return (int)Math.Round((float)this.SampleRate / (this.HiPeriodSamples + this.LoPeriodSamples) / 2);
				}
				else
				{
					// Detected on full period
					return (int)Math.Round((float)this.SampleRate / (this.HiPeriodSamples + this.LoPeriodSamples));
				}
			}
		}

		public FrequencyData()
		{
		}

		public FrequencyData(int sampleRate, int lastSample, int hiPeriodSamples, int loPeriodSamples)
		{
			this.SampleRate = sampleRate;
			this.LastSample = lastSample;
			this.HiPeriodSamples = hiPeriodSamples;
			this.LoPeriodSamples = loPeriodSamples;
		}
	}
}
