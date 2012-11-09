namespace MC_8_DumpReader
{
	partial class Analyzer
	{
		/// <summary> 
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary> 
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Component Designer generated code

		/// <summary> 
		/// Required method for Designer support - do not modify 
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.gbxFileSelection = new System.Windows.Forms.GroupBox();
			this.tbxFile = new System.Windows.Forms.TextBox();
			this.btnSelectFile = new System.Windows.Forms.Button();
			this.gbxAnalyze = new System.Windows.Forms.GroupBox();
			this.cboHiFreqTolerance = new System.Windows.Forms.ComboBox();
			this.hiFreqTolerance = new System.Windows.Forms.Label();
			this.lblLoFreqTolerance = new System.Windows.Forms.Label();
			this.cboLoFreqTolerance = new System.Windows.Forms.ComboBox();
			this.splitContainer1 = new System.Windows.Forms.SplitContainer();
			this.ucDisplaySample = new MC_8_DumpReader.DisplaySample();
			this.tabData = new System.Windows.Forms.TabControl();
			this.tabPageFreqData = new System.Windows.Forms.TabPage();
			this.dgvFreqDetect = new System.Windows.Forms.DataGridView();
			this.RowNo = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.Freq = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.HiPeriodSamples = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.LoPeriodSamples = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.FirstSample = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.LastSample = new System.Windows.Forms.DataGridViewTextBoxColumn();
			this.tabPageBitstreamData = new System.Windows.Forms.TabPage();
			this.dgvBitstream = new System.Windows.Forms.DataGridView();
			this.splitter1 = new System.Windows.Forms.Splitter();
			this.tbxLog = new System.Windows.Forms.TextBox();
			this.btnClearLog = new System.Windows.Forms.Button();
			this.btnSaveWave = new System.Windows.Forms.Button();
			this.btnStartAnalyze = new System.Windows.Forms.Button();
			this.selectFileToAnalize = new System.Windows.Forms.OpenFileDialog();
			this.saveWaveDialog = new System.Windows.Forms.SaveFileDialog();
			this.gbxFileSelection.SuspendLayout();
			this.gbxAnalyze.SuspendLayout();
			this.splitContainer1.Panel1.SuspendLayout();
			this.splitContainer1.Panel2.SuspendLayout();
			this.splitContainer1.SuspendLayout();
			this.tabData.SuspendLayout();
			this.tabPageFreqData.SuspendLayout();
			((System.ComponentModel.ISupportInitialize)(this.dgvFreqDetect)).BeginInit();
			this.tabPageBitstreamData.SuspendLayout();
			((System.ComponentModel.ISupportInitialize)(this.dgvBitstream)).BeginInit();
			this.SuspendLayout();
			// 
			// gbxFileSelection
			// 
			this.gbxFileSelection.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.gbxFileSelection.Controls.Add(this.tbxFile);
			this.gbxFileSelection.Controls.Add(this.btnSelectFile);
			this.gbxFileSelection.Location = new System.Drawing.Point(3, 3);
			this.gbxFileSelection.Name = "gbxFileSelection";
			this.gbxFileSelection.Size = new System.Drawing.Size(1068, 52);
			this.gbxFileSelection.TabIndex = 1;
			this.gbxFileSelection.TabStop = false;
			this.gbxFileSelection.Text = "Select wave file";
			// 
			// tbxFile
			// 
			this.tbxFile.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.tbxFile.Location = new System.Drawing.Point(6, 19);
			this.tbxFile.Name = "tbxFile";
			this.tbxFile.Size = new System.Drawing.Size(1024, 20);
			this.tbxFile.TabIndex = 1;
			// 
			// btnSelectFile
			// 
			this.btnSelectFile.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.btnSelectFile.Location = new System.Drawing.Point(1036, 17);
			this.btnSelectFile.Name = "btnSelectFile";
			this.btnSelectFile.Size = new System.Drawing.Size(26, 23);
			this.btnSelectFile.TabIndex = 0;
			this.btnSelectFile.Text = "...";
			this.btnSelectFile.UseVisualStyleBackColor = true;
			this.btnSelectFile.Click += new System.EventHandler(this.btnSelectFile_Click);
			// 
			// gbxAnalyze
			// 
			this.gbxAnalyze.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.gbxAnalyze.Controls.Add(this.cboHiFreqTolerance);
			this.gbxAnalyze.Controls.Add(this.hiFreqTolerance);
			this.gbxAnalyze.Controls.Add(this.lblLoFreqTolerance);
			this.gbxAnalyze.Controls.Add(this.cboLoFreqTolerance);
			this.gbxAnalyze.Controls.Add(this.splitContainer1);
			this.gbxAnalyze.Controls.Add(this.btnClearLog);
			this.gbxAnalyze.Controls.Add(this.btnSaveWave);
			this.gbxAnalyze.Controls.Add(this.btnStartAnalyze);
			this.gbxAnalyze.Location = new System.Drawing.Point(3, 61);
			this.gbxAnalyze.Name = "gbxAnalyze";
			this.gbxAnalyze.Size = new System.Drawing.Size(1068, 589);
			this.gbxAnalyze.TabIndex = 2;
			this.gbxAnalyze.TabStop = false;
			this.gbxAnalyze.Text = "Analyze";
			// 
			// cboHiFreqTolerance
			// 
			this.cboHiFreqTolerance.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboHiFreqTolerance.FormattingEnabled = true;
			this.cboHiFreqTolerance.Items.AddRange(new object[] {
            "0",
            "5",
            "10",
            "15",
            "20",
            "25",
            "30",
            "35",
            "40",
            "45",
            "50"});
			this.cboHiFreqTolerance.Location = new System.Drawing.Point(311, 21);
			this.cboHiFreqTolerance.Name = "cboHiFreqTolerance";
			this.cboHiFreqTolerance.Size = new System.Drawing.Size(59, 21);
			this.cboHiFreqTolerance.TabIndex = 10;
			// 
			// hiFreqTolerance
			// 
			this.hiFreqTolerance.AutoSize = true;
			this.hiFreqTolerance.Location = new System.Drawing.Point(202, 24);
			this.hiFreqTolerance.Name = "hiFreqTolerance";
			this.hiFreqTolerance.Size = new System.Drawing.Size(103, 13);
			this.hiFreqTolerance.TabIndex = 9;
			this.hiFreqTolerance.Text = "Hi Freq Tolerance %";
			// 
			// lblLoFreqTolerance
			// 
			this.lblLoFreqTolerance.AutoSize = true;
			this.lblLoFreqTolerance.Location = new System.Drawing.Point(6, 24);
			this.lblLoFreqTolerance.Name = "lblLoFreqTolerance";
			this.lblLoFreqTolerance.Size = new System.Drawing.Size(103, 13);
			this.lblLoFreqTolerance.TabIndex = 8;
			this.lblLoFreqTolerance.Text = "Lo Freq Toreance %";
			// 
			// cboLoFreqTolerance
			// 
			this.cboLoFreqTolerance.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.cboLoFreqTolerance.FormattingEnabled = true;
			this.cboLoFreqTolerance.Items.AddRange(new object[] {
            "0",
            "5",
            "10",
            "15",
            "20",
            "25",
            "30",
            "35",
            "40",
            "45",
            "50"});
			this.cboLoFreqTolerance.Location = new System.Drawing.Point(115, 21);
			this.cboLoFreqTolerance.Name = "cboLoFreqTolerance";
			this.cboLoFreqTolerance.Size = new System.Drawing.Size(59, 21);
			this.cboLoFreqTolerance.TabIndex = 7;
			// 
			// splitContainer1
			// 
			this.splitContainer1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.splitContainer1.Location = new System.Drawing.Point(6, 48);
			this.splitContainer1.Name = "splitContainer1";
			this.splitContainer1.Orientation = System.Windows.Forms.Orientation.Horizontal;
			// 
			// splitContainer1.Panel1
			// 
			this.splitContainer1.Panel1.Controls.Add(this.ucDisplaySample);
			// 
			// splitContainer1.Panel2
			// 
			this.splitContainer1.Panel2.Controls.Add(this.tabData);
			this.splitContainer1.Panel2.Controls.Add(this.splitter1);
			this.splitContainer1.Panel2.Controls.Add(this.tbxLog);
			this.splitContainer1.Size = new System.Drawing.Size(1056, 535);
			this.splitContainer1.SplitterDistance = 197;
			this.splitContainer1.TabIndex = 6;
			// 
			// ucDisplaySample
			// 
			this.ucDisplaySample.Dock = System.Windows.Forms.DockStyle.Fill;
			this.ucDisplaySample.Location = new System.Drawing.Point(0, 0);
			this.ucDisplaySample.Name = "ucDisplaySample";
			this.ucDisplaySample.SampleData = null;
			this.ucDisplaySample.Size = new System.Drawing.Size(1056, 197);
			this.ucDisplaySample.TabIndex = 4;
			// 
			// tabData
			// 
			this.tabData.Controls.Add(this.tabPageFreqData);
			this.tabData.Controls.Add(this.tabPageBitstreamData);
			this.tabData.Dock = System.Windows.Forms.DockStyle.Fill;
			this.tabData.Location = new System.Drawing.Point(485, 0);
			this.tabData.Name = "tabData";
			this.tabData.SelectedIndex = 0;
			this.tabData.Size = new System.Drawing.Size(571, 334);
			this.tabData.TabIndex = 7;
			// 
			// tabPageFreqData
			// 
			this.tabPageFreqData.Controls.Add(this.dgvFreqDetect);
			this.tabPageFreqData.Location = new System.Drawing.Point(4, 22);
			this.tabPageFreqData.Name = "tabPageFreqData";
			this.tabPageFreqData.Padding = new System.Windows.Forms.Padding(3);
			this.tabPageFreqData.Size = new System.Drawing.Size(563, 308);
			this.tabPageFreqData.TabIndex = 0;
			this.tabPageFreqData.Text = "Frequency data";
			this.tabPageFreqData.UseVisualStyleBackColor = true;
			// 
			// dgvFreqDetect
			// 
			this.dgvFreqDetect.AllowUserToAddRows = false;
			this.dgvFreqDetect.AllowUserToDeleteRows = false;
			this.dgvFreqDetect.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
			this.dgvFreqDetect.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
			this.dgvFreqDetect.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.RowNo,
            this.Freq,
            this.HiPeriodSamples,
            this.LoPeriodSamples,
            this.FirstSample,
            this.LastSample});
			this.dgvFreqDetect.Dock = System.Windows.Forms.DockStyle.Fill;
			this.dgvFreqDetect.Location = new System.Drawing.Point(3, 3);
			this.dgvFreqDetect.Name = "dgvFreqDetect";
			this.dgvFreqDetect.ReadOnly = true;
			this.dgvFreqDetect.Size = new System.Drawing.Size(557, 302);
			this.dgvFreqDetect.TabIndex = 5;
			this.dgvFreqDetect.RowHeaderMouseClick += new System.Windows.Forms.DataGridViewCellMouseEventHandler(this.dgvFreqDetect_RowHeaderMouseClick);
			// 
			// RowNo
			// 
			this.RowNo.DataPropertyName = "RowNo";
			this.RowNo.HeaderText = "No";
			this.RowNo.Name = "RowNo";
			this.RowNo.ReadOnly = true;
			// 
			// Freq
			// 
			this.Freq.DataPropertyName = "Frequency";
			this.Freq.HeaderText = "Frequency";
			this.Freq.Name = "Freq";
			this.Freq.ReadOnly = true;
			// 
			// HiPeriodSamples
			// 
			this.HiPeriodSamples.DataPropertyName = "HiPeriodSamples";
			this.HiPeriodSamples.HeaderText = "Hi Period";
			this.HiPeriodSamples.Name = "HiPeriodSamples";
			this.HiPeriodSamples.ReadOnly = true;
			// 
			// LoPeriodSamples
			// 
			this.LoPeriodSamples.DataPropertyName = "LoPeriodSamples";
			this.LoPeriodSamples.HeaderText = "Lo Period";
			this.LoPeriodSamples.Name = "LoPeriodSamples";
			this.LoPeriodSamples.ReadOnly = true;
			// 
			// FirstSample
			// 
			this.FirstSample.DataPropertyName = "FirstSample";
			this.FirstSample.HeaderText = "First Sample";
			this.FirstSample.Name = "FirstSample";
			this.FirstSample.ReadOnly = true;
			// 
			// LastSample
			// 
			this.LastSample.DataPropertyName = "LastSample";
			this.LastSample.HeaderText = "Last Sample";
			this.LastSample.Name = "LastSample";
			this.LastSample.ReadOnly = true;
			// 
			// tabPageBitstreamData
			// 
			this.tabPageBitstreamData.Controls.Add(this.dgvBitstream);
			this.tabPageBitstreamData.Location = new System.Drawing.Point(4, 22);
			this.tabPageBitstreamData.Name = "tabPageBitstreamData";
			this.tabPageBitstreamData.Padding = new System.Windows.Forms.Padding(3);
			this.tabPageBitstreamData.Size = new System.Drawing.Size(563, 308);
			this.tabPageBitstreamData.TabIndex = 1;
			this.tabPageBitstreamData.Text = "Bitstream data";
			this.tabPageBitstreamData.UseVisualStyleBackColor = true;
			// 
			// dgvBitstream
			// 
			this.dgvBitstream.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
			this.dgvBitstream.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
			this.dgvBitstream.Dock = System.Windows.Forms.DockStyle.Fill;
			this.dgvBitstream.Location = new System.Drawing.Point(3, 3);
			this.dgvBitstream.Name = "dgvBitstream";
			this.dgvBitstream.Size = new System.Drawing.Size(557, 302);
			this.dgvBitstream.TabIndex = 6;
			this.dgvBitstream.RowHeaderMouseClick += new System.Windows.Forms.DataGridViewCellMouseEventHandler(this.dgvBitstream_RowHeaderMouseClick);
			// 
			// splitter1
			// 
			this.splitter1.Location = new System.Drawing.Point(482, 0);
			this.splitter1.Name = "splitter1";
			this.splitter1.Size = new System.Drawing.Size(3, 334);
			this.splitter1.TabIndex = 2;
			this.splitter1.TabStop = false;
			// 
			// tbxLog
			// 
			this.tbxLog.Dock = System.Windows.Forms.DockStyle.Left;
			this.tbxLog.Location = new System.Drawing.Point(0, 0);
			this.tbxLog.Multiline = true;
			this.tbxLog.Name = "tbxLog";
			this.tbxLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
			this.tbxLog.Size = new System.Drawing.Size(482, 334);
			this.tbxLog.TabIndex = 1;
			// 
			// btnClearLog
			// 
			this.btnClearLog.Location = new System.Drawing.Point(555, 19);
			this.btnClearLog.Name = "btnClearLog";
			this.btnClearLog.Size = new System.Drawing.Size(75, 23);
			this.btnClearLog.TabIndex = 3;
			this.btnClearLog.Text = "Clear log";
			this.btnClearLog.UseVisualStyleBackColor = true;
			this.btnClearLog.Click += new System.EventHandler(this.btnClearLog_Click);
			// 
			// btnSaveWave
			// 
			this.btnSaveWave.Location = new System.Drawing.Point(474, 19);
			this.btnSaveWave.Name = "btnSaveWave";
			this.btnSaveWave.Size = new System.Drawing.Size(75, 23);
			this.btnSaveWave.TabIndex = 2;
			this.btnSaveWave.Text = "Save wave";
			this.btnSaveWave.UseVisualStyleBackColor = true;
			this.btnSaveWave.Click += new System.EventHandler(this.btnSaveWave_Click);
			// 
			// btnStartAnalyze
			// 
			this.btnStartAnalyze.Location = new System.Drawing.Point(393, 19);
			this.btnStartAnalyze.Name = "btnStartAnalyze";
			this.btnStartAnalyze.Size = new System.Drawing.Size(75, 23);
			this.btnStartAnalyze.TabIndex = 0;
			this.btnStartAnalyze.Text = "Start";
			this.btnStartAnalyze.UseVisualStyleBackColor = true;
			this.btnStartAnalyze.Click += new System.EventHandler(this.btnStartAnalyze_Click);
			// 
			// selectFileToAnalize
			// 
			this.selectFileToAnalize.Filter = "Wav files|*.wav";
			this.selectFileToAnalize.ReadOnlyChecked = true;
			this.selectFileToAnalize.Title = "Select wav file";
			// 
			// saveWaveDialog
			// 
			this.saveWaveDialog.DefaultExt = "wav";
			this.saveWaveDialog.Filter = "Wave files|*.wav";
			this.saveWaveDialog.Title = "Select file to save";
			// 
			// Analyzer
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.Controls.Add(this.gbxAnalyze);
			this.Controls.Add(this.gbxFileSelection);
			this.Name = "Analyzer";
			this.Size = new System.Drawing.Size(1074, 653);
			this.gbxFileSelection.ResumeLayout(false);
			this.gbxFileSelection.PerformLayout();
			this.gbxAnalyze.ResumeLayout(false);
			this.gbxAnalyze.PerformLayout();
			this.splitContainer1.Panel1.ResumeLayout(false);
			this.splitContainer1.Panel2.ResumeLayout(false);
			this.splitContainer1.Panel2.PerformLayout();
			this.splitContainer1.ResumeLayout(false);
			this.tabData.ResumeLayout(false);
			this.tabPageFreqData.ResumeLayout(false);
			((System.ComponentModel.ISupportInitialize)(this.dgvFreqDetect)).EndInit();
			this.tabPageBitstreamData.ResumeLayout(false);
			((System.ComponentModel.ISupportInitialize)(this.dgvBitstream)).EndInit();
			this.ResumeLayout(false);

		}

		#endregion

		private System.Windows.Forms.GroupBox gbxFileSelection;
		private System.Windows.Forms.TextBox tbxFile;
		private System.Windows.Forms.Button btnSelectFile;
		private System.Windows.Forms.GroupBox gbxAnalyze;
		private System.Windows.Forms.ComboBox cboHiFreqTolerance;
		private System.Windows.Forms.Label hiFreqTolerance;
		private System.Windows.Forms.Label lblLoFreqTolerance;
		private System.Windows.Forms.ComboBox cboLoFreqTolerance;
		private System.Windows.Forms.SplitContainer splitContainer1;
		private DisplaySample ucDisplaySample;
		private System.Windows.Forms.TabControl tabData;
		private System.Windows.Forms.TabPage tabPageFreqData;
		private System.Windows.Forms.DataGridView dgvFreqDetect;
		private System.Windows.Forms.DataGridViewTextBoxColumn RowNo;
		private System.Windows.Forms.DataGridViewTextBoxColumn Freq;
		private System.Windows.Forms.DataGridViewTextBoxColumn HiPeriodSamples;
		private System.Windows.Forms.DataGridViewTextBoxColumn LoPeriodSamples;
		private System.Windows.Forms.DataGridViewTextBoxColumn FirstSample;
		private System.Windows.Forms.DataGridViewTextBoxColumn LastSample;
		private System.Windows.Forms.TabPage tabPageBitstreamData;
		private System.Windows.Forms.DataGridView dgvBitstream;
		private System.Windows.Forms.Splitter splitter1;
		private System.Windows.Forms.TextBox tbxLog;
		private System.Windows.Forms.Button btnClearLog;
		private System.Windows.Forms.Button btnSaveWave;
		private System.Windows.Forms.Button btnStartAnalyze;
		private System.Windows.Forms.OpenFileDialog selectFileToAnalize;
		private System.Windows.Forms.SaveFileDialog saveWaveDialog;
	}
}
