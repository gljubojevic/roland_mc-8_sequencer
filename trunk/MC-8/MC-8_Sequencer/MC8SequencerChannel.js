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
	this.Notes = new Array();

	this.NoteCurrent = 0;
	this.NoteCurrentStep = 0;

	this.config = {
		containerId: '#seqChannels',
		rowsBeforeEdit:5,
		rowsAfterEdit:5
	}

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

	this.NoteAdd = function()
	{
	}


	this.createTemplate = function ()
	{
		// Get Assigned CVS
		var CVs = this.CVGetArray();

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
		var html = this.createTemplate();
		var container = $(this.config.containerId);
		if ($('#ch' + this.ChannelNo, container).length > 0) {
			$('#ch' + this.ChannelNo, container).replaceWith(html);
		}
		else {
			container.append(html);
		}

		// TODO Atach events
	}

	// Create html
	this.Init = function ()
	{
		this.buildChannelDisplay();
	}
}