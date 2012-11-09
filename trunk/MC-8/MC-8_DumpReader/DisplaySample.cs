using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace MC_8_DumpReader
{
	public partial class DisplaySample : UserControl
	{
		private float _pixelsPerSample = 1.0f;
		private float[] _zoomPixelsPerSample = { 0.1f, 0.2f, 0.5f, 1, 1.5f, 2.0f, 3.0f };

		private short[] _sampleData;
		public short[] SampleData
		{
			get	{	return this._sampleData;	}
			set
			{
				this._sampleData = value;
				if (null!= this._sampleData)
				{
					this.hScrollSamplePos.Enabled = true;
					this.hScrollSamplePos.Minimum = 0;
					this.hScrollSamplePos.Maximum = this._sampleData.Length;
					this.hScrollSamplePos.Value = 0;
				}
				this.Invalidate();
			}
		}

		Pen _graphPen = new Pen(Color.Black, 1.0f);
		Pen _linePen = new Pen(Color.Blue, 1.0f);
		Pen _linePenSelected = new Pen(Color.Red, 2.0f);
		Font _defFont = new Font("Arial", 10);
		Font _smallFont = new Font("Arial", 8);

		private int _selectedFrom = 0;
		private int _selectedTo = 0;

		public DisplaySample()
		{
			InitializeComponent();
			this.hScrollSamplePos.Enabled = false;
		}

		public void SelectSample(int from, int to)
		{
			this._selectedFrom = from;
			this._selectedTo = to;

			int window = (int)Math.Round(this.DisplayRectangle.Width / _pixelsPerSample);
			int scrollPos = this._selectedFrom - (window / 2);
			if (scrollPos < 0)
			{	scrollPos = 0;	}
			this.hScrollSamplePos.Value = scrollPos;
			this.Invalidate();
		}

		private void DrawBg(PaintEventArgs pe)
		{
			float x,y,y1;
			//pe.Graphics.Clear(this.BackColor);
			pe.Graphics.Clear(Color.White);
			y = pe.ClipRectangle.Top + pe.ClipRectangle.Height / 2;
			pe.Graphics.DrawLine(this._graphPen, pe.ClipRectangle.Left, y, pe.ClipRectangle.Right, y);

			int samplesBetweenLines = 50;
			int firstSample = (this.hScrollSamplePos.Value / samplesBetweenLines +1) * samplesBetweenLines;
			x = pe.ClipRectangle.Left + (samplesBetweenLines - (this.hScrollSamplePos.Value % samplesBetweenLines)) * this._pixelsPerSample;
			y = pe.ClipRectangle.Bottom;
			y1 = y-15;
			while (x < pe.ClipRectangle.Right)
			{
				pe.Graphics.DrawLine(this._graphPen, x, y, x, y1);
				if (this._pixelsPerSample >= 1.0)
				{	pe.Graphics.DrawString(firstSample.ToString(), this._smallFont, Brushes.Black, x, y1);	}

				x += samplesBetweenLines * this._pixelsPerSample;
				firstSample += samplesBetweenLines;
			}
		}

		private void DrawSample(PaintEventArgs pe)
		{
			float x1, y1, x2, y2;

			if (null == this._sampleData)
			{	return;		}

			//Center and scale
			int yCenter = pe.ClipRectangle.Top + pe.ClipRectangle.Height / 2;
			float vScale = pe.ClipRectangle.Height / 2.0f / short.MaxValue;

			int samplePos = this.hScrollSamplePos.Value;
			string txtSamplePos = string.Format("First sample pos:{0} val:{1}", samplePos, this._sampleData[samplePos]);

			bool selectionActive = this._selectedFrom != this._selectedTo;
			bool selected = selectionActive && (samplePos >= this._selectedFrom && samplePos <= this._selectedTo);

			x1 = pe.ClipRectangle.Left;
			y1 = yCenter - (int)Math.Round(this._sampleData[samplePos++] * vScale);

			while (x1 < pe.ClipRectangle.Right && samplePos < this._sampleData.Length)
			{
				// Check still selected
				selected = selectionActive && (samplePos >= this._selectedFrom && samplePos <= this._selectedTo);

				x2 = x1 + _pixelsPerSample;
				y2 = yCenter - (int)Math.Round(this._sampleData[samplePos++] * vScale);
				
				pe.Graphics.DrawLine(selected ? this._linePenSelected : this._linePen, x1, y1, x2, y2);
				//pe.Graphics.DrawRectangle(this._linePen, x2-1, y2, 2.0f, 2.0f);
				
				// Copy current point to first point
				x1 = x2;
				y1 = y2;
			}

			SizeF txtSize = pe.Graphics.MeasureString(txtSamplePos, _defFont);
			pe.Graphics.DrawString(
				txtSamplePos, this._defFont, Brushes.Blue, pe.ClipRectangle.Right-txtSize.Width, pe.ClipRectangle.Top
			);
		}

		protected override void OnPaint(PaintEventArgs pe)
		{
			base.OnPaint(pe);
			this.DrawBg(pe);
			this.DrawSample(pe);
		}

		private void hScrollSamplePos_ValueChanged(object sender, EventArgs e)
		{
			this.Invalidate();
		}

		private void DisplaySample_Resize(object sender, EventArgs e)
		{
			this.Invalidate();
		}

		private void tbZoom_ValueChanged(object sender, EventArgs e)
		{
			this._pixelsPerSample = this._zoomPixelsPerSample[this.tbZoom.Value];
			this.Invalidate();
		}
	}
}
