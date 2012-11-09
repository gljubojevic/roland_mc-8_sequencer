using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Text;
using System.Windows.Forms;

namespace MC_8_DumpReader
{
	public partial class Sequencer : UserControl
	{
		public MC8Sequencer MC8Sequencer;
		ComboBox[] cboCVtoCH = new ComboBox[8];
		DataTable[] dtbChannels = new DataTable[8];
		DataGridView[] dgvChannels = new DataGridView[8];

		public Sequencer()
		{
			InitializeComponent();
			this.MC8Sequencer = new MC8Sequencer();
			this.InitCVCBO();
			this.InitDataGrids();
		}

		#region Init

		private void InitCVCBO()
		{
			cboCVtoCH[0] = this.cboCV1CH;
			cboCVtoCH[1] = this.cboCV2CH;
			cboCVtoCH[2] = this.cboCV3CH;
			cboCVtoCH[3] = this.cboCV4CH;
			cboCVtoCH[4] = this.cboCV5CH;
			cboCVtoCH[5] = this.cboCV6CH;
			cboCVtoCH[6] = this.cboCV7CH;
			cboCVtoCH[7] = this.cboCV8CH;

			for (int i = 0; i < 9; i++)
			{
				for (int j = 0; j < cboCVtoCH.Length; j++)
				{
					if (0 == i)
					{
						this.cboCVtoCH[j].Items.Clear();
						this.cboCVtoCH[j].Items.Add("CH--");
						this.cboCVtoCH[j].SelectedIndex = 0;
					}
					else
					{
						this.cboCVtoCH[j].Items.Add("CH" + i);
					}
				}
			}
		}

		private DataTable CreateDataTable()
		{
			DataTable dtb = new DataTable();
			dtb.Columns.Add("GT", typeof(byte));
			dtb.Columns.Add("ST", typeof(byte));
			return dtb;
		}

		private void InitDataGrids()
		{
			this.dgvChannels[0] = this.dgvCH0;
			this.dgvChannels[1] = this.dgvCH1;
			this.dgvChannels[2] = this.dgvCH2;
			this.dgvChannels[3] = this.dgvCH3;
			this.dgvChannels[4] = this.dgvCH4;
			this.dgvChannels[5] = this.dgvCH5;
			this.dgvChannels[6] = this.dgvCH6;
			this.dgvChannels[7] = this.dgvCH7;

			for (int i = 0; i < this.dgvChannels.Length; i++)
			{
				this.dtbChannels[i] = this.CreateDataTable();
				this.dgvChannels[i].DataSource = this.dtbChannels[i];
				this.dgvChannels[i].Enabled = false;
			}
		}
		
		#endregion

		private void cbo_SelectedIndexChanged(object sender, EventArgs e)
		{
			ComboBox cbo = (ComboBox)sender;
			string CH = (string)cbo.Items[cbo.SelectedIndex];

			if (CH == "CH--")
			{	return;	}

			int chNo = Int32.Parse(CH.Replace("CH",string.Empty)) - 1;
			this.dtbChannels[chNo].Columns.Add((string)cbo.Tag, typeof(byte)).SetOrdinal(0);
			this.dgvChannels[chNo].Enabled = true;
		}



	}
}
