using System;
using System.Collections.Generic;
using System.Text;

namespace MC_8_DumpReader
{
	public class MC8Sequencer
	{
		public class MC8Note
		{
			public byte CV { get; set; }		// 0 - 127
			public byte StepTime { get; set; }	// 1 - 256
			public byte GateTime { get; set; }	// 0 - 255
		}

		public List<MC8Note> Channel0 { get; set; }
		public List<MC8Note> Channel1 { get; set; }
		public List<MC8Note> Channel2 { get; set; }
		public List<MC8Note> Channel3 { get; set; }
		public List<MC8Note> Channel4 { get; set; }
		public List<MC8Note> Channel5 { get; set; }
		public List<MC8Note> Channel6 { get; set; }
		public List<MC8Note> Channel7 { get; set; }

		public int Tempo { get; set; }
		public int TimeBase { get; set; }

		// MC-8 Constants
		public const int MC8MemorySize = 0x4000;
		public const int MC8MemoryStart = 0x4000;
		public const byte MC8EOB = 0xff;

		// This is MC-8 memory, start Address is 0x4000
		private byte[] _memory;

		public MC8Sequencer()
		{

		}

		private void ResetMemory()
		{
			this._memory = new byte[MC8MemorySize];
			for (int i = 0; i < this._memory.Length; i++)
			{	this._memory[i] = 0;	}
		}

		public void LoadDecodedBytes(byte[] decoded)
		{
			this.ResetMemory();

			int checksum;
			int memAddress;
			byte blockSize;
			int pos = 0;
			while (0 < decoded[pos])
			{
				checksum = decoded[pos];
				blockSize = decoded[pos++];

				checksum += decoded[pos];
				checksum += decoded[pos + 1];
				memAddress = ((decoded[pos++] << 8) | decoded[pos++]) & MC8MemoryStart - 1;

				for (byte i = 0; i < blockSize; i++)
				{
					checksum += decoded[pos];
					this._memory[memAddress++] = decoded[pos++];
				}

				// Check Checksum
				checksum = ((checksum ^ 0xff) + 1) & 0xff;
				if (checksum != decoded[pos++])
				{	throw new ApplicationException(string.Format("Invalid checksum found at byte:{0}.", pos - 1));	}

				// Check end od block
				if (MC8EOB != decoded[pos++])
				{	throw new ApplicationException(string.Format("Missing end of block marker at byte:{0}.", pos - 1));	}
			}
		}
	}
}
