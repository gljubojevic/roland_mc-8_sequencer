namespace MC_8_DumpReader
{
	partial class DisplaySample
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
			this.hScrollSamplePos = new System.Windows.Forms.HScrollBar();
			this.tbZoom = new System.Windows.Forms.TrackBar();
			((System.ComponentModel.ISupportInitialize)(this.tbZoom)).BeginInit();
			this.SuspendLayout();
			// 
			// hScrollSamplePos
			// 
			this.hScrollSamplePos.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.hScrollSamplePos.Location = new System.Drawing.Point(0, 245);
			this.hScrollSamplePos.Name = "hScrollSamplePos";
			this.hScrollSamplePos.Size = new System.Drawing.Size(491, 17);
			this.hScrollSamplePos.TabIndex = 0;
			this.hScrollSamplePos.ValueChanged += new System.EventHandler(this.hScrollSamplePos_ValueChanged);
			// 
			// tbZoom
			// 
			this.tbZoom.LargeChange = 1;
			this.tbZoom.Location = new System.Drawing.Point(0, 0);
			this.tbZoom.Maximum = 6;
			this.tbZoom.Name = "tbZoom";
			this.tbZoom.Size = new System.Drawing.Size(104, 45);
			this.tbZoom.TabIndex = 1;
			this.tbZoom.Value = 3;
			this.tbZoom.ValueChanged += new System.EventHandler(this.tbZoom_ValueChanged);
			// 
			// DisplaySample
			// 
			this.Controls.Add(this.tbZoom);
			this.Controls.Add(this.hScrollSamplePos);
			this.Name = "DisplaySample";
			this.Size = new System.Drawing.Size(491, 262);
			this.Resize += new System.EventHandler(this.DisplaySample_Resize);
			((System.ComponentModel.ISupportInitialize)(this.tbZoom)).EndInit();
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.HScrollBar hScrollSamplePos;
		private System.Windows.Forms.TrackBar tbZoom;

	}
}
