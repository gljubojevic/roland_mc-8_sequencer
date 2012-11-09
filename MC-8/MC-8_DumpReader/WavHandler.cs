using System;
using System.IO;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	public class WavHandler
	{
		private byte[] _tmpLong = new byte[4];
		private byte[] _tmpShort = new byte[2];

		public int fileSize = 0;
		public short audioFormat = 0;
		public short numChannels = 0;
		public int sampleRate = 0;
		public int byteRate = 0;
		public short blockAlign = 0;
		public short bitsPerSample = 0;

		public byte[] _data;
		public short[] samples;

		public WavHandler()
		{
		}

		public void Load(string fileName)
		{
			int size;
			string chunk;

			using (FileStream fs = File.OpenRead(fileName))
			{
				chunk = this.ReadChunkId(fs);
				if (chunk != "RIFF")
				{	throw new InvalidDataException("Not valid wave file, can't find RIFF.");	}

				this.fileSize = this.ReadLong(fs) + 8;

				chunk = this.ReadChunkId(fs);
				if (chunk != "WAVE")
				{	throw new InvalidDataException("Not valid wave file, can't find WAVE.");	}

				chunk = this.ReadChunkId(fs);
				if (chunk != "fmt ")
				{ throw new InvalidDataException("Not valid wave file, can't find fmt."); }
				size = this.ReadLong(fs);
				this.audioFormat = this.ReadShort(fs);
				this.numChannels = this.ReadShort(fs);
				this.sampleRate = this.ReadLong(fs);
				this.byteRate = this.ReadLong(fs);
				this.blockAlign = this.ReadShort(fs);
				this.bitsPerSample = this.ReadShort(fs);

				chunk = this.ReadChunkId(fs);
				if (chunk != "data")
				{ throw new InvalidDataException("Not valid wave file, can't find data."); }
				size = this.ReadLong(fs);
				this._data = new byte[size];
				fs.Read(this._data, 0, size);
			}

			// Create samples for anlize
			this.CreateSamples();
		}

		public void Save(string fileName)
		{
			int size = 4; // WAVE
			size += 4 + 4 + 16; // fmt + fmt size
			size += 4 + 4 + samples.Length*2; // data

			using (FileStream fs = File.OpenWrite(fileName))
			{
				this.WriteChunkId(fs, "RIFF");
				this.WriteLong(fs, size);

				this.WriteChunkId(fs, "WAVE");
	
				this.WriteChunkId(fs, "fmt ");
				this.WriteLong(fs, 16);
				this.WriteShort(fs, this.audioFormat);
				this.WriteShort(fs, this.numChannels);
				this.WriteLong(fs, this.sampleRate);
				this.WriteLong(fs, this.byteRate);
				this.WriteShort(fs, this.blockAlign);
				this.WriteShort(fs, this.bitsPerSample);

				this.WriteChunkId(fs, "data");
				this.WriteLong(fs, this.samples.Length * 2);
				for (int i = 0; i < this.samples.Length; i++)
				{	this.WriteShort(fs, this.samples[i]);	}

				fs.Close();
			}
		}

		private string ReadChunkId(FileStream fs)
		{
			fs.Read(this._tmpLong, 0, this._tmpLong.Length);
			return Encoding.ASCII.GetString(this._tmpLong, 0, this._tmpLong.Length);
		}

		private void WriteChunkId(FileStream fs, string chunkId)
		{
			byte[] ba = Encoding.ASCII.GetBytes(chunkId);
			fs.Write(ba, 0, ba.Length); 
		}

		private int ReadLong(FileStream fs)
		{
			fs.Read(this._tmpLong, 0, this._tmpLong.Length);
			return BitConverter.ToInt32(this._tmpLong, 0);
		}

		private void WriteLong(FileStream fs, int lng)
		{
			fs.Write(BitConverter.GetBytes(lng), 0, 4);
		}

		private short ReadShort(FileStream fs)
		{
			fs.Read(this._tmpShort, 0, this._tmpShort.Length);
			return BitConverter.ToInt16(this._tmpShort, 0);
		}

		private void WriteShort(FileStream fs, short sh)
		{
			fs.Write(BitConverter.GetBytes(sh), 0, 2);
		}

		private void CreateSamples()
		{
			this.samples = new short[this._data.Length / 2];

			for (int i = 0; i < this._data.Length / 2; i++)
			{	this.samples[i] = BitConverter.ToInt16(this._data, i * 2);	}
		}
	}
}
