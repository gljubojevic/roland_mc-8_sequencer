using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Text;
using System.Windows.Forms;

namespace MC_8_DumpReader
{
	public partial class Analyzer : UserControl
	{
		public MC8Analyzer MC8Analyzer;

		public Analyzer()
		{
			InitializeComponent();

			this.dgvFreqDetect.AutoGenerateColumns = false;
			this.MC8Analyzer = new MC8Analyzer();
			this.MC8Analyzer.Progress += new EventHandler<ProgressEventArgs>(MC8Analyzer_Progress);
			this.cboLoFreqTolerance.SelectedIndex = 2;
			this.cboHiFreqTolerance.SelectedIndex = 4;
		}

		#region Progress events

		void MC8Analyzer_Progress(object sender, ProgressEventArgs e)
		{
			this.LogMessage(e.Message);
		}

		#endregion

		#region Logging output

		private void LogMessage(string msg)
		{
			this.tbxLog.AppendText(
				string.Format("{0:yyyy-MM-dd HH:mm:ss.fff} {1}\r\n", DateTime.Now, msg)
			);
		}

		#endregion

		#region Button events

		private void btnSelectFile_Click(object sender, EventArgs e)
		{
			if (DialogResult.OK == this.selectFileToAnalize.ShowDialog(this))
			{ this.tbxFile.Text = this.selectFileToAnalize.FileName; }
		}

		private void btnStartAnalyze_Click(object sender, EventArgs e)
		{
			try
			{
				// reset datagrid source
				if (null != this.dgvFreqDetect.DataSource)
				{
					this.dgvFreqDetect.DataSource = null;
					this.dgvFreqDetect.Refresh();
				}

				if (null != this.dgvFreqDetect.DataSource)
				{
					this.dgvBitstream.DataSource = null;
					this.dgvBitstream.Refresh();
				}

				// Start loading 
				if (this.MC8Analyzer.LoadWave(this.tbxFile.Text.Trim()))
				{
					// Display loaded sample
					this.ucDisplaySample.SampleData = this.MC8Analyzer.WavHandler.samples;

					// Set params for conversion
					this.MC8Analyzer.BitStreamDecoder.HiFreqTolerance = float.Parse(this.cboLoFreqTolerance.Items[this.cboHiFreqTolerance.SelectedIndex].ToString()) / 100.0f;
					this.MC8Analyzer.BitStreamDecoder.LoFreqTolerance = float.Parse(this.cboLoFreqTolerance.Items[this.cboLoFreqTolerance.SelectedIndex].ToString()) / 100.0f;

					// analyze and load data
					this.MC8Analyzer.LoadFromTape();

					// Display Frequency detect data
					this.dgvFreqDetect.DataSource = this.MC8Analyzer.FrequencyDetectData;
					// Display bitstream detect data
					this.dgvBitstream.DataSource = this.MC8Analyzer.BitStreamDecoder.DecodedData;
				}
			}
			catch (Exception ex)
			{ this.LogMessage(ex.ToString()); }
		}

		private void btnSaveWave_Click(object sender, EventArgs e)
		{
			try
			{
				if (DialogResult.OK == this.saveWaveDialog.ShowDialog(this))
				{
					this.MC8Analyzer.SaveToTape(this.saveWaveDialog.FileName);
				}
			}
			catch (Exception ex)
			{ this.tbxLog.AppendText(ex.ToString()); }

		}

		private void btnClearLog_Click(object sender, EventArgs e)
		{
			this.tbxLog.Clear();
		}

		#endregion

		#region Grid Events

		private void dgvFreqDetect_RowHeaderMouseClick(object sender, DataGridViewCellMouseEventArgs e)
		{
			FrequencyData dta = this.MC8Analyzer.FrequencyDetectData[e.RowIndex];
			this.ucDisplaySample.SelectSample(dta.FirstSample, dta.LastSample);
		}

		private void dgvBitstream_RowHeaderMouseClick(object sender, DataGridViewCellMouseEventArgs e)
		{
			BitData dta = this.MC8Analyzer.BitStreamDecoder.DecodedData[e.RowIndex];
			this.ucDisplaySample.SelectSample(dta.FirstSample, dta.LastSample);
		}

		#endregion
	}
}
