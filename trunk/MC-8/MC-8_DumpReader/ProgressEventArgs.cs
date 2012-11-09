using System;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	/// <summary>
	/// Small class to making progress display
	/// </summary>
	public class ProgressEventArgs : EventArgs
	{
		public int Percent { get; set; }
		public string Message { get; set; }
		public bool Cancel { get; set; }

		public ProgressEventArgs()
		{
			this.Percent = 0;
			this.Cancel = false;
			this.Message = null;
		}

		public ProgressEventArgs(int percent, string message)
			: this()
		{
			this.Percent = percent;
			this.Message = message;
		}
	}
}
