using System;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	/// <summary>
	/// Class to keep bitstream data
	/// </summary>
	public class BitData
	{
		public int BitNo { get; set; }
		public int Value { get; set; }

		public int FirstSample 
		{
			get	{	return this.AllFrequencyData[0].FirstSample;	}
		}

		public int LastSample 
		{
			get	{	return this.AllFrequencyData[this.AllFrequencyData.Count - 1].LastSample;	}
		}

		public int Freq { get; set; }
		public int FreqDetected { get; set; }

		public int Count
		{
			get	{	return this.AllFrequencyData.Count;		}
		}
		
		public List<FrequencyData> AllFrequencyData { get; set; }

		public BitData()
		{
			this.Value = -1;
			this.AllFrequencyData = new List<FrequencyData>();
		}

		public BitData(int bitNo) : this()
		{
			this.BitNo = bitNo;
		}
	}
}
