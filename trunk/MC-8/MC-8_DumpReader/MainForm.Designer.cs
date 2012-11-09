namespace MC_8_DumpReader
{
	partial class MainForm
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

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.tabForm = new System.Windows.Forms.TabControl();
			this.tabSequencer = new System.Windows.Forms.TabPage();
			this.ucSequencer = new MC_8_DumpReader.Sequencer();
			this.tabAnalyzer = new System.Windows.Forms.TabPage();
			this.ucAnalyzer = new MC_8_DumpReader.Analyzer();
			this.tabForm.SuspendLayout();
			this.tabSequencer.SuspendLayout();
			this.tabAnalyzer.SuspendLayout();
			this.SuspendLayout();
			// 
			// tabForm
			// 
			this.tabForm.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.tabForm.Controls.Add(this.tabSequencer);
			this.tabForm.Controls.Add(this.tabAnalyzer);
			this.tabForm.Location = new System.Drawing.Point(12, 12);
			this.tabForm.Name = "tabForm";
			this.tabForm.SelectedIndex = 0;
			this.tabForm.Size = new System.Drawing.Size(1046, 646);
			this.tabForm.TabIndex = 0;
			// 
			// tabSequencer
			// 
			this.tabSequencer.Controls.Add(this.ucSequencer);
			this.tabSequencer.Location = new System.Drawing.Point(4, 22);
			this.tabSequencer.Name = "tabSequencer";
			this.tabSequencer.Padding = new System.Windows.Forms.Padding(3);
			this.tabSequencer.Size = new System.Drawing.Size(1038, 620);
			this.tabSequencer.TabIndex = 0;
			this.tabSequencer.Text = "Sequencer";
			this.tabSequencer.UseVisualStyleBackColor = true;
			// 
			// ucSequencer
			// 
			this.ucSequencer.Dock = System.Windows.Forms.DockStyle.Fill;
			this.ucSequencer.Location = new System.Drawing.Point(3, 3);
			this.ucSequencer.Name = "ucSequencer";
			this.ucSequencer.Size = new System.Drawing.Size(1032, 614);
			this.ucSequencer.TabIndex = 0;
			// 
			// tabAnalyzer
			// 
			this.tabAnalyzer.Controls.Add(this.ucAnalyzer);
			this.tabAnalyzer.Location = new System.Drawing.Point(4, 22);
			this.tabAnalyzer.Name = "tabAnalyzer";
			this.tabAnalyzer.Padding = new System.Windows.Forms.Padding(3);
			this.tabAnalyzer.Size = new System.Drawing.Size(1038, 620);
			this.tabAnalyzer.TabIndex = 1;
			this.tabAnalyzer.Text = "Analyzer";
			this.tabAnalyzer.UseVisualStyleBackColor = true;
			// 
			// ucAnalyzer
			// 
			this.ucAnalyzer.Dock = System.Windows.Forms.DockStyle.Fill;
			this.ucAnalyzer.Location = new System.Drawing.Point(3, 3);
			this.ucAnalyzer.Name = "ucAnalyzer";
			this.ucAnalyzer.Size = new System.Drawing.Size(1032, 614);
			this.ucAnalyzer.TabIndex = 0;
			// 
			// MainForm
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(1070, 670);
			this.Controls.Add(this.tabForm);
			this.Name = "MainForm";
			this.Text = "MC-8 Dump analyzer";
			this.tabForm.ResumeLayout(false);
			this.tabSequencer.ResumeLayout(false);
			this.tabAnalyzer.ResumeLayout(false);
			this.ResumeLayout(false);

		}

		#endregion

		private System.Windows.Forms.TabControl tabForm;
		private System.Windows.Forms.TabPage tabSequencer;
		private System.Windows.Forms.TabPage tabAnalyzer;
		private Analyzer ucAnalyzer;
		private Sequencer ucSequencer;


	}
}

