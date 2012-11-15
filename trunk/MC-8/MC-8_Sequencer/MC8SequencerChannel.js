function MC8SequencerNote()
{
	this.CV0 = 0;
	this.CV1 = 0;
	this.CV2 = 0;
	this.CV3 = 0;
	this.CV4 = 0;
	this.CV5 = 0;
	this.CV6 = 0;
	this.CV7 = 0;
	this.Gate = 0;
	this.StepTime = 0;
}

function MC8SequencerChannel(channelNo)
{
	// Set channel no on construction
	this.ChannelNo = channelNo;

	// This is bit field, each CV is one bit in assigment
	this.CVAssinged = 0;

	// Notes Array
	this.Notes = new Array();

	// Playback control
	this.NoteCurrent = 0;
	this.NoteCurrentStep = 0;

	// Config for channel
	this.config = {
		containerId: '#seqChannels',
		rowsBeforeEdit:5,
		rowsAfterEdit:5
	}

	// variables
	var _container = null;
	var _channelDisplay = null;
	var _tbxStepTime = null;
	var _tbxGate = null;
	var _tbxCVs = null;

	/////////////////////////////
	// CV management
	/////////////////////////////

	this.CVCheckAssigned = function (cv) {
		return 0 != (this.CVAssinged & (1 << cv));
	}

	this.CVAdd = function (cv) {
		if (!this.CVCheckAssigned(cv)) {
			this.CVAssinged |= (1 << cv);
			this.buildChannelDisplay();
		}
	}

	this.CVRem = function (cv) {
		if (this.CVCheckAssigned(cv)) {
			this.CVAssinged ^= (1 << cv);
			this.buildChannelDisplay();
		}
	}

	this.CVGetArray = function ()
	{
		var CVs = new Array();

		for (var i = 0; i < 8; i++)
		{
			if (this.CVCheckAssigned(i))
			{ CVs.push("CV" + i); }
		}

		return CVs;
	}

	/////////////////////////////
	// Data loading
	/////////////////////////////

	this.loadCV = function (cv, from, count, data)
	{
		var cvAdr = "CV" + cv;

		for (var i = 0; i < count; i++) {

			// Only add notes when filing CV
			if (this.Notes.length < i+1) {
				this.NoteAdd();
			}

			// Set object property as associative array
			this.Notes[i][cvAdr] = data[from++];
		}
	}

	this.loadGate = function (from, count, data)
	{
		for (var i = 0; i < count; i++) {
			this.Notes[i].Gate = data[from++];
		}
	}

	this.loadStep = function (from, count, data)
	{
		for (var i = 0; i < count; i++) {
			this.Notes[i].StepTime = data[from++];
		}
	}

	/////////////////////////////
	// Note managemnet
	/////////////////////////////

	this.NoteAdd = function()
	{
		var note = new MC8SequencerNote();
		this.Notes.push(note);
	}

	/////////////////////////////
	// Display
	/////////////////////////////

	this.createTemplate = function (CVs)
	{
		// Get Row for single note
		var noteRow = '<tr>';
		for (var i = 0; i < CVs.length; i++)
		{ noteRow += '<td>---</td>'; }
		noteRow += '<td>---</td><td>---</td></tr>'

		// Build table
		var html = '<table id="ch' + this.ChannelNo + '" class="channel">';
		html += '<caption>Channel ' + this.ChannelNo + '</caption>';
		html += '<thead><tr>';
		if (CVs.length > 0)
		{ html += '<th>' + CVs.join('</th><th>') + '</th>'; }
		html += '<th>Step</th><th>Gate</th></tr></thead>';

		html += '<tbody class="NotesBeforeEdit">';
		for (var i = 0; i < this.config.rowsBeforeEdit; i++)
		{ html += noteRow; }
		html += '</tbody>';

		html += '<tbody class="NotesEdit"><tr>';
		for (var i = 0; i < CVs.length; i++)
		{ html += '<td><input id="CH' + this.ChannelNo + CVs[i] + '" type="text" size="3" maxlength="3" /></td>'; }
		html += '<td><input id="CH' + this.ChannelNo + 'Step" type="text" size="3" maxlength="3" /></td>';
		html += '<td><input id="CH' + this.ChannelNo + 'Gate" type="text" size="3" maxlength="3" /></td>';
		html += '</tr></tbody>';

		html += '<tbody class="NotesAfterEdit">';
		for (var i = 0; i < this.config.rowsBeforeEdit; i++)
		{ html += noteRow; }
		html += '</tbody>';

		html += '</table>';

		return html;
	}


	this.buildChannelDisplay = function()
	{
		// Get Container ref
		_container = $(this.config.containerId);

		// Get Assigned CVS
		var CVs = this.CVGetArray();
		// Create html template
		var html = this.createTemplate(CVs);

		if (0 == $('#ch' + this.ChannelNo, _container).length) {
			_container.append(html);
		}
		else {
			$('#ch' + this.ChannelNo, _container).replaceWith(html);
		}

		// Get ref to channel display
		_channelDisplay = $('#ch' + this.ChannelNo, _container);

		// Text boxes, associative array for easier access later
		_tbxCVs = new Array();
		for (var i = 0; i < CVs.length; i++) {
			var tbxCV = $('#CH' + this.ChannelNo + CVs[i], _channelDisplay);
			_tbxCVs[CVs[i]] = tbxCV;
		}
		_tbxGate = $('#CH' + this.ChannelNo + 'Gate', _channelDisplay);
		_tbxStepTime = $('#CH' + this.ChannelNo + 'Step', _channelDisplay);

		// TODO Atach events
	}


	this.displayNotes = function() {
		
		// Exit if no notes
		if (0 == this.Notes.length) {
			return;
		}

		// Get Assigned CVS
		var CVs = this.CVGetArray();

		// Display Current note
		for (var i = 0; i < CVs.length; i++) {
			_tbxCVs[CVs[i]].val(this.Notes[this.NoteCurrent][CVs[i]]);
		}
		_tbxGate.val(this.Notes[this.NoteCurrent].Gate);
		_tbxStepTime.val(this.Notes[this.NoteCurrent].StepTime);
	}

	/////////////////////////////
	// Init
	/////////////////////////////

	// Create html
	this.Init = function ()
	{
		this.buildChannelDisplay();
	}
}