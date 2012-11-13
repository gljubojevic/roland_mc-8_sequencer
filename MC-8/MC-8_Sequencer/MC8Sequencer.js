/// <reference path="MC8Analyzer.js" />
/// <reference path="MC8SequencerChannel.js" />

var MC8Sequencer = function ()
{
	// Config
	var config = {
		btnLoadFromAnalyzerId: '#btnLoadFromAnalyzer'
	};
	
	var _sequencer = this;


	/////////////////////////////
	// Load sequencer memory
	/////////////////////////////

	var MC8MemoryStart = 0x4000;
	var MC8MemorySize = 0x4000;
	var MC8EOB = 0xff;

	var _MC8Memory;

	this.resetMC8Memory = function()
	{
		// Init MC-8 memory
		_MC8Memory = new Array(MC8MemorySize);
		for (var i = 0; i < _MC8Memory.length; i++) {
			_MC8Memory[i] = 0;
		}
	}

	// load bytes in memory
	this.loadMC8Memory = function(dataBytes)
	{
		this.resetMC8Memory();
			
		var checksum;
		var memAddress;
		var blockSize;
		var pos = 0;
		while (0 < dataBytes[pos])
		{
			checksum = dataBytes[pos];
			blockSize = dataBytes[pos++];

			checksum += dataBytes[pos];
			checksum += dataBytes[pos + 1];
			memAddress = ((dataBytes[pos++] << 8) | dataBytes[pos++]) & (MC8MemoryStart - 1);

			for (var i = 0; i < blockSize; i++)
			{
				checksum += dataBytes[pos];
				_MC8Memory[memAddress++] = dataBytes[pos++];
			}

			// Check Checksum
			checksum = ((checksum ^ 0xff & 0xff) + 1) & 0xff;
			if (checksum != dataBytes[pos++])
			{	throw "Invalid checksum found at byte:" + (pos - 1);	}

			// Check end od block
			if (MC8EOB != dataBytes[pos++])
			{	throw "Missing end of block marker at byte:" + (pos - 1);	}
		}
	}

	// Data is byte array
	this.loadSequence = function(data)
	{
		this.loadMC8Memory(data);
		// TODO: Create channels
		// TODO: Load channel data
		// TODO: Display channel data
	}


	/////////////////////////////
	// Init
	/////////////////////////////

	// Init and attach
	this.initSequencer = function () {
		// btn load from analyzer
		$(config.btnLoadFromAnalyzerId).click(function () {
			_sequencer.loadSequence(MC8Analyzer.SequencerBytes);
		});
	};

	// Return entire object
	return this;
} ();