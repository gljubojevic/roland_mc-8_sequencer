using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace MC_8_DumpReader
{
	public partial class MainForm : Form
	{
		public MainForm()
		{
			InitializeComponent();

			this.ucAnalyzer.MC8Analyzer.ByteStreamDecoded += new EventHandler<EventArgs>(MC8Analyzer_ByteStreamDecoded);
		}

		void MC8Analyzer_ByteStreamDecoded(object sender, EventArgs e)
		{
			this.ucSequencer.MC8Sequencer.LoadDecodedBytes(this.ucAnalyzer.MC8Analyzer.DecodedBytes);
		}
	}
}
