/// <reference path="MC8Analyzer.js" />
/// <reference path="MC8SequencerChannel.js" />

var MC8Sequencer = function ()
{
	// Config
	var config = {
		selCVPrefixId: '#selCV',
		btnLoadFromAnalyzerId: '#btnLoadFromAnalyzer'
	};

	var _sequencer = this;

	var _channels;

	/////////////////////////////
	// Channel assigment
	/////////////////////////////
	this.CVAssign = function (cv, ch)
	{
		// Check if allready assigned to same channel
		if (-1 != ch && _channels[ch].CVCheckAssigned(cv))
		{
			return;
		}

		// Remove CV from existing channel			
		for (var i = 0; i < _channels.length; i++)
		{
			_channels[i].CVRem(cv);
		}

		// Add to new channel
		if (-1 != ch)
		{
			_channels[ch].CVAdd(cv);
		}
	}

	/////////////////////////////
	// Load sequencer memory
	/////////////////////////////

	var MC8MemoryStart = 0x4000;
	var MC8MemoryMask = MC8MemoryStart - 1;
	var MC8MemorySize = 0x4000;
	var MC8EOB = 0xff;
	var MC8SongConfig = 0x400c; // Song definition starts at this address

	var MC8CVCheckMask = 0xc0;
	var MC8StepMask = 0xc0;
	var MC8GateMask = 0xe0;
	var MC8CVCHMask = 0x07;

	var _MC8Memory;

	this.resetMC8Memory = function ()
	{
		// Init MC-8 memory
		_MC8Memory = new Array(MC8MemorySize);
		for (var i = 0; i < _MC8Memory.length; i++)
		{
			_MC8Memory[i] = 0;
		}
	}

	// load bytes in memory
	this.loadMC8Memory = function (dataBytes)
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
			memAddress = ((dataBytes[pos++] << 8) | dataBytes[pos++]) & MC8MemoryMask;

			for (var i = 0; i < blockSize; i++)
			{
				checksum += dataBytes[pos];
				_MC8Memory[memAddress++] = dataBytes[pos++];
			}

			// Check Checksum
			checksum = ((checksum ^ 0xff & 0xff) + 1) & 0xff;
			if (checksum != dataBytes[pos++])
			{ throw "Invalid checksum found at byte:" + (pos - 1); }

			// Check end od block
			if (MC8EOB != dataBytes[pos++])
			{ throw "Missing end of block marker at byte:" + (pos - 1); }
		}
	}

	this.loadChannelData = function ()
	{
		// Get song config address in array
		var pos = MC8SongConfig & MC8MemoryMask;

		// Read song until end of song reached
		while (MC8EOB != _MC8Memory[pos])
		{
			// Get type what we load
			var dataType = _MC8Memory[pos++];
			// Extract channel
			var ch = dataType & MC8CVCHMask;

			// From where to load
			var dataFrom = (_MC8Memory[pos++] | (_MC8Memory[pos++] << 8)) & MC8MemoryMask;
			var dataTo = (_MC8Memory[pos + 1] | (_MC8Memory[pos + 2] << 8)) & MC8MemoryMask;

			if (0 == (dataType & MC8CVCheckMask))
			{
				// this is CV
				var cv = (dataType >> 3) & MC8CVCHMask;
				_channels[ch].CVAdd(cv);
				_channels[ch].loadCV(cv, dataFrom, dataTo, _MC8Memory);
			}
			else if (MC8StepMask == (dataType & MC8StepMask))
			{
				// this is Step
				_channels[ch].loadStep(dataFrom, dataTo, _MC8Memory);
			}
			else if (MC8GateMask == (dataType & MC8GateMask))
			{
				// this is Gate
				_channels[ch].loadGate(dataFrom, dataTo, _MC8Memory);
			}
		}
	}

	// Data is byte array
	this.loadSequence = function (data)
	{
		// TODO: Reset current channels
		this.loadMC8Memory(data);
		this.loadChannelData();
		// TODO: Create channels
		// TODO: Load channel data
		// TODO: Display channel data
	}


	/////////////////////////////
	// Init
	/////////////////////////////

	// Init and attach
	this.initSequencer = function ()
	{
		// Create empty channels
		_channels = new Array();
		for (var i = 0; i < 8; i++)
		{
			var chn = new MC8SequencerChannel(i);
			chn.Init();
			_channels.push(chn);
		}

		// Initi channel assigment
		for (var i = 0; i < 8; i++)
		{
			var ops = '<option value="-1">CH--</option>';
			for (var j = 0; j < 8; j++)
			{
				ops += '<option value="' + j + '">CH' + j + '</option>';
			}
			var sel = $(config.selCVPrefixId + i);
			sel.append(ops);

			sel.change(function ()
			{
				var ch = parseInt($(this).val());
				var cv = parseInt($(this).attr('id').replace(config.selCVPrefixId.replace('#', ''), ''));
				_sequencer.CVAssign(cv, ch);
			});
		}

		// btn load from analyzer
		$(config.btnLoadFromAnalyzerId).click(function ()
		{
			_sequencer.loadSequence(MC8Analyzer.SequencerBytes);
		});
	};

	// Return entire object
	return this;
} ();