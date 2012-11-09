using System;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	/// <summary>
	/// Class to emulate Roland MC-8 sequencer
	/// </summary>
	public class MC8Analyzer
	{
		private WavProcessor _wavProcessor;
		public WavHandler WavHandler;
		public MC8BitStreamDecoder BitStreamDecoder;

		public List<FrequencyData> FrequencyDetectData;
		public event EventHandler<ProgressEventArgs> Progress;
		public event EventHandler<EventArgs> ByteStreamDecoded;

		public bool FrequencyDetectOnLo { get; set; }
		public bool FrequencyDetectOnHalfPeriod { get; set; }

		public byte[] DecodedBytes;

		public MC8Analyzer()
		{
			this.WavHandler = new WavHandler();
			this._wavProcessor = new WavProcessor();
			this.BitStreamDecoder = new MC8BitStreamDecoder();

			this.FrequencyDetectOnLo = true;
			this.FrequencyDetectOnHalfPeriod = true;
		}

		private bool TrackProgress(int percent, string message)
		{
			if (null != this.Progress)
			{
				ProgressEventArgs args = new ProgressEventArgs(percent, message);
				this.Progress(this, args);
				return args.Cancel;
			}

			return false;
		}


		#region Byte decoder

		/// <summary>
		/// Decode byte from bit stream
		/// </summary>
		/// <param name="byteStart">Start position to read byte</param>
		/// <returns>decoded byte</returns>
		private byte BitStreamReadByte(int byteStart, bool lsbFirst)
		{
			int tmp = 0;
			int currentBit = byteStart;
			if (lsbFirst)
			{
				for (int i = 0; i < 8; i++)
				{
					if ('1' == this.BitStreamDecoder.Decoded[currentBit++])
					{ tmp |= (1 << i); }

					if (currentBit >= this.BitStreamDecoder.Decoded.Length - 1)
					{ break; }
				}
			}
			else
			{
				for (int i = 7; i >= 0; i--)
				{
					if ('1' == this.BitStreamDecoder.Decoded[currentBit++])
					{ tmp |= (1 << i); }

					if (currentBit >= this.BitStreamDecoder.Decoded.Length - 1)
					{ break; }
				}
			}

			return (byte)(tmp & 0xff);
		}

		/// <summary>
		/// Decode some stop bits
		/// </summary>
		/// <param name="stopBitsStart">Start position to read stop bits</param>
		/// <param name="count">Number of stop bits</param>
		/// <returns>decoded stop bits</returns>
		private string BitStreamReadStopBits(int stopBitsStart, int count)
		{
			string stopBits = string.Empty;
			int currentBit = stopBitsStart;
			for (int i = 0; i < count; i++)
			{
				if (currentBit >= this.BitStreamDecoder.Decoded.Length - 1)
				{	break;	}
				stopBits += this.BitStreamDecoder.Decoded[currentBit++];
			}

			return stopBits;
		}

		private byte[] BitStreamToBytes()
		{
			// Create buffer for bytes 2x MC-8 memory
			byte[] buffer = new byte[32768];
			int byteBufferPos = 0;
			string byteString;
			byte tmp;

			this.TrackProgress(0, "Decoding bytes");

			// Skip leading "1" by finding first "0"
			int currentBit = this.BitStreamDecoder.Decoded.IndexOf('0');
			// Skip first 0 also, this means that byte start marker is "110"
			currentBit++;

			while (currentBit < this.BitStreamDecoder.Decoded.Length - 1)
			{
				// Decode byte
				tmp = this.BitStreamReadByte(currentBit, true);

				// Skip decoded bits
				currentBit += 8;
				if (currentBit >= this.BitStreamDecoder.Decoded.Length - 1)
				{	break;	}
				// Get decoded byte to string
				byteString = this.BitStreamDecoder.Decoded.Substring(currentBit - 8, 8);


				// Skip stop bits
				byteString += " s" + this.BitStreamReadStopBits(currentBit, 3);
				currentBit += 3;
				if (currentBit >= this.BitStreamDecoder.Decoded.Length - 1)
				{ break; }

				// Show some progress
				this.TrackProgress(0,
					string.Format("Byte {0:D5}:%{1}\t0x{2:x2}\t{2:D3}", byteBufferPos, byteString, tmp)
				);

				// Store byte and move to next byte
				buffer[byteBufferPos++] = tmp;
			}

			this.TrackProgress(100, "Done");

			// Return byte buffer
			byte[] arrRet = new byte[byteBufferPos];
			for (int i = 0; i < byteBufferPos; i++)
			{ arrRet[i] = buffer[i]; }

			return arrRet;
		}

		#endregion

		/// <summary>
		/// Load Wave file for processing
		/// </summary>
		/// <param name="fileName">Filename to load</param>
		/// <returns>true when wave file loaded</returns>
		public bool LoadWave(string fileName)
		{
			this.TrackProgress(0, string.Format("Loading: {0}", fileName));
			this.WavHandler.Load(fileName);

			this.TrackProgress(0, string.Format("Audio format:{0}", this.WavHandler.audioFormat));
			if (1 != this.WavHandler.audioFormat)
			{
				this.TrackProgress(0, "ERROR invalid audio format. only PCM is supported.");
				return false;
			}

			this.TrackProgress(0, string.Format("Number of channels:{0}", this.WavHandler.numChannels));
			if (1 != this.WavHandler.numChannels)
			{
				this.TrackProgress(0, "ERROR invalid number of channels. only Mono is supported.");
				return false;
			}

			this.TrackProgress(0, string.Format("Sample rate:{0}", this.WavHandler.sampleRate));
			if (44100 != this.WavHandler.sampleRate)
			{
				this.TrackProgress(0, "ERROR invalid sample rate. only 44100Hz is supported.");
				return false;
			}

			this.TrackProgress(0, string.Format("Byte rate:{0}", this.WavHandler.byteRate));
			this.TrackProgress(0, string.Format("Block align:{0}", this.WavHandler.blockAlign));
			this.TrackProgress(0, string.Format("Bits per sample:{0}", this.WavHandler.bitsPerSample));
			if (16 != this.WavHandler.bitsPerSample)
			{
				this.TrackProgress(0, "ERROR invalid bits per sample. only 16bit is supported.");
				return false;
			}

			return true;
		}
		
		public void LoadFromTape()
		{
			bool freqDetected = false;
			this.TrackProgress(0, "Processing tape wave...");

			// Get frequency data from wave
			this.FrequencyDetectData = new List<FrequencyData>();
			this._wavProcessor.Threshold = 0.0f;
			this._wavProcessor.FindNormalizeFactor(this.WavHandler.samples);
			this._wavProcessor.SimpleFreqDetectionReset(this.WavHandler.sampleRate);
			for (int i = 0; i < this.WavHandler.samples.Length; i++)
			{
				short val = this.WavHandler.samples[i];
				val = this._wavProcessor.NormalizeFilter(val);
				val = this._wavProcessor.QuadraticFilter(val);

				if (this.FrequencyDetectOnHalfPeriod)
				{
					// Use frequency detection on half period
					freqDetected = this._wavProcessor.SimpleFreqDetection(val, i);
				}
				else
				{
					// Use frequency detection on full period, and choose between lo or high freq detectino 
					if (this.FrequencyDetectOnLo)
					{	freqDetected =this._wavProcessor.SimpleFreqDetectionOnLo(val, i);	}
					else
					{	freqDetected = this._wavProcessor.SimpleFreqDetectionOnHi(val, i);	}
				}

				// Add to list of detected frequencies
				if (freqDetected)
				{
					this._wavProcessor.FreqDetected.RowNo = this.FrequencyDetectData.Count;
					this.FrequencyDetectData.Add(this._wavProcessor.FreqDetected);
				}
			}

			// Get Bitstream from frequency data
			this.BitStreamDecoder.Start(this.FrequencyDetectOnHalfPeriod);
			for (int i = 0; i < this.FrequencyDetectData.Count; i++)
			{
				// Send to bit stream decoder
				if (!this.BitStreamDecoder.Decode(this.FrequencyDetectData[i]))
				{
					this.TrackProgress(0,
						string.Format(
							"Error unknown Freq {0}Hz\tSample:{1} ({2:0.000}s)",
							this.FrequencyDetectData[i].Frequency, this.FrequencyDetectData[i].FirstSample, this.FrequencyDetectData[i].FirstSample / 44100.0f
						)
					);
				}
			}
	
			this.TrackProgress(100, "Done");
			this.TrackProgress(100, this.BitStreamDecoder.Decoded);

			// Get byte array from data
			this.DecodedBytes = this.BitStreamToBytes();
			if (null != this.ByteStreamDecoded)
			{	this.ByteStreamDecoded(this, new EventArgs());	}
		}


		
		public void SaveToTape(string fileName)
		{

		}
	}
}
