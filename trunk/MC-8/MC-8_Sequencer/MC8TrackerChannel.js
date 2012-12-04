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

function MC8TrackerChannel(channelNo, rowsBeforeEdit, rowsAfterEdit) {

	// Constants
	var MC8MeasueEndMask = 0x80;
	var MC8CVMask = 0x7f;

	// Definition of note names
	this.NoteDisplay=['C -','C#-','D -','D#-','E -', 'F -','F#-','G -','G#-','A -','A#-','B -'];

	// Set channel number on construction
	this.ChannelNo = channelNo;

	// Playback control
	this.NoteCurrent = 0;
	this.NoteCurrentStep = 0;

	// This is bit field, each CV is one bit in assigment
	this.CVAssinged = 0;

	// Notes Array
	this.Notes = new Array();

	// Config for channel
	this.config = {
		containerId: '#seqChannels',
		rowsBeforeEdit: rowsBeforeEdit,
		rowsAfterEdit: rowsAfterEdit,
		editStepUpDownCallback: null
	}

	// variables
	var _container = null;
	var _channelDisplay = null;
	var _tbxStepTime = null;
	var _cbxMeasueEnd = null;
	var _tbxGate = null;
	var _tbxCVs = null;
	var _tableRowsAfterEdit = null;
	var _tableRowsBeforeEdit = null;

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

	this.loadStep = function (from, count, data) {
		for (var i = 0; i < count; i++) {
			this.Notes[i].StepTime = data[from++];
		}
	}

	this.loadGate = function (from, count, data) {
		for (var i = 0; i < count; i++) {
			this.Notes[i].Gate = data[from++];
		}
	}

	/////////////////////////////
	// Data saving
	/////////////////////////////

	// TODO: Calculate measure end
	this.saveCV = function (cv, mem, dataAdr) {
		var cvAdr = "CV" + cv;

		// Copy CV to memory
		for (var i = 0; i < this.Notes.length; i++) {
			mem[dataAdr++] = this.Notes[i][cvAdr];
		}

		return dataAdr;
	}

	this.saveStep = function (mem, dataAdr) {
		for (var i = 0; i < this.Notes.length; i++) {
			mem[dataAdr++] = this.Notes[i].StepTime;
		}

		return dataAdr;
	}

	this.saveGate = function (mem, dataAdr) {
		for (var i = 0; i < this.Notes.length; i++) {
			mem[dataAdr++] = this.Notes[i].Gate;
		}

		return dataAdr;
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
	// Playback
	/////////////////////////////

	this.sequencerRun = function () {
		if (0 == this.Notes.length || this.NoteCurrent >= this.Notes.length) {
			return;
		}

		if (this.NoteCurrentStep > this.Notes[this.NoteCurrent].StepTime) {
			this.NoteCurrentStep = 0;
			this.NoteCurrent++;
		}

		if (0 == this.NoteCurrentStep && this.NoteCurrent < this.Notes.length) {
			// TODO: Playback note
		}

		this.displayNotes();

		// Next step
		this.NoteCurrentStep++;
	}

	this.sequencerStop = function () {
		this.NoteCurrent = 0;
		this.NoteCurrentStep = 0;
		this.displayNotes();
	}

	/////////////////////////////
	// Edit
	/////////////////////////////

	this.editStepUpDown = function (direction) {
		if (0 == this.Notes.length || this.NoteCurrent >= this.Notes.length) {
			return;
		}

		this.NoteCurrentStep += direction;

		if (this.NoteCurrentStep > this.Notes[this.NoteCurrent].StepTime) {
			this.NoteCurrentStep = 0;
			this.NoteCurrent++;
		}
		else if (this.NoteCurrentStep < 0) {
			this.NoteCurrent--;
			if (this.NoteCurrent >= 0) {
				this.NoteCurrentStep = this.Notes[this.NoteCurrent].StepTime;
			}
			else {
				this.NoteCurrent = 0;
				this.NoteCurrentStep = 0;
			}
		}

		if (0 == this.NoteCurrentStep && this.NoteCurrent < this.Notes.length) {
			// TODO: Playback note
		}

		this.displayNotes();
	}

	// TODO: end edit write note
	this.editNoteFinished = function ()
	{
		
	}

	// Handle key down on edit fields
	this.editHandleKeyDown = function(event)
	{
		switch (event.which) {
			case 38:
				event.preventDefault();
				if (null != this.config.editStepUpDownCallback) {
					this.config.editStepUpDownCallback(-1);
				}
				break;

			case 40:
				event.preventDefault();
				if (null != this.config.editStepUpDownCallback) {
					this.config.editStepUpDownCallback(1);
				}
				break;

			case 13:
				event.preventDefault();
				this.editNoteFinished();
				if (null != this.config.editStepUpDownCallback) {
					this.config.editStepUpDownCallback(1);
				}
				break;

			default:
				// TODO: Check allowed characters
				break;
		}
	}

	/////////////////////////////
	// Display
	/////////////////////////////

	this.createTemplate = function (CVs) {
		// Get Row for single note
		var noteRow = '<tr>';
		for (var i = 0; i < CVs.length; i++)
		{ noteRow += '<td>---</td>'; }
		noteRow += '<td>---</td><td>-</td><td>---</td></tr>'

		// Build table
		var html = '<table id="ch' + this.ChannelNo + '" class="channel">';
		html += '<caption>Channel ' + this.ChannelNo + '</caption>';
		html += '<thead><tr>';
		if (CVs.length > 0)
		{ html += '<th>' + CVs.join('</th><th>') + '</th>'; }
		html += '<th>Step</th><th>ME</th><th>Gate</th></tr></thead>';

		html += '<tbody class="NotesBeforeEdit">';
		for (var i = 0; i < this.config.rowsBeforeEdit; i++)
		{ html += noteRow; }
		html += '</tbody>';

		html += '<tbody class="NotesEdit"><tr>';
		for (var i = 0; i < CVs.length; i++)
		{ html += '<td><input id="CH' + this.ChannelNo + CVs[i] + '" type="text" size="3" maxlength="3" /></td>'; }
		html += '<td><input id="CH' + this.ChannelNo + 'Step" type="text" size="3" maxlength="3" /></td>';
		html += '<td><input id="CH' + this.ChannelNo + 'MeasureEnd" type="checkbox" /></td>';
		html += '<td><input id="CH' + this.ChannelNo + 'Gate" type="text" size="3" maxlength="3" /></td>';
		html += '</tr></tbody>';

		html += '<tbody class="NotesAfterEdit">';
		for (var i = 0; i < this.config.rowsBeforeEdit; i++)
		{ html += noteRow; }
		html += '</tbody>';
		html += '<tfoot>';
		html += '<tr><td colspan="' + CVs.length + 3 + '">';
		html += '<a title="Add note">[Add]</a>&nbsp;';
		html += '<a title="Insert note">[Ins]</a>&nbsp;';
		html += '<a title="Delete note">[Del]</a>';
		html += '</td></tr>';
		html += '</tfoot>';

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

		// Get rows before edit
		_tableRowsBeforeEdit = $('tbody.NotesBeforeEdit > tr', _channelDisplay);
		// Get rows after edit
		_tableRowsAfterEdit = $('tbody.NotesAfterEdit > tr', _channelDisplay);

		// Text boxes, associative array for easier access later
		_tbxCVs = new Array();
		for (var i = 0; i < CVs.length; i++) {
			var tbxCV = $('#CH' + this.ChannelNo + CVs[i], _channelDisplay);
			_tbxCVs[CVs[i]] = tbxCV;
		}
		_tbxGate = $('#CH' + this.ChannelNo + 'Gate', _channelDisplay);
		_tbxStepTime = $('#CH' + this.ChannelNo + 'Step', _channelDisplay);
		_cbxMeasueEnd = $('#CH' + this.ChannelNo + 'MeasureEnd', _channelDisplay);

		// Atach keyboard events
		var chn = this;
		for (var i = 0; i < CVs.length; i++) {
			_tbxCVs[CVs[i]].keydown(function(event){
				chn.editHandleKeyDown(event)
			});
		}

		_tbxGate.keydown(function (event) {
			chn.editHandleKeyDown(event);
		});

		_tbxStepTime.keydown(function (event) {
			chn.editHandleKeyDown(event);
		});
	}

	this.getNoteString = function (cv)
	{
		cv &= MC8CVMask; // Get only CV
		return this.NoteDisplay[cv % 12].replace('-', Math.floor(cv/ 12));
	}

	this.displayEmptyRow = function (tr) {
		for (var i = 0; i < tr.cells.length; i++) {
			tr.cells[i].innerHTML = '&nbsp;';
		}
	}

	this.displayNoteRow = function (tr, note, CVs) {
		var cellIdx = 0;
		var measureEnd = false;
		for (var i = 0; i < CVs.length; i++) {
			tr.cells[cellIdx++].innerText = this.getNoteString(note[CVs[i]]);
			if (0 != (note[CVs[i]] & MC8MeasueEndMask)) {
				measureEnd = true;
			}
		}
		tr.cells[cellIdx++].innerText = note.StepTime + 1;	// Step time is always 1-256
		tr.cells[cellIdx++].innerText = measureEnd ? 'Y' : ' ';
		tr.cells[cellIdx++].innerText = note.Gate;
	}

	this.displayNotes = function () {
		var step;
		var noteIdx;
		var tableRows;

		// Exit if no notes
		if (0 == this.Notes.length) {
			return;
		}

		// Get Assigned CVS
		var CVs = this.CVGetArray();

		// Get Current index
		noteIdx = this.NoteCurrent;

		// Display Current note in editor
		if (noteIdx < this.Notes.length && 0 == this.NoteCurrentStep) {
			var measueEnd = false;
			for (var i = 0; i < CVs.length; i++) {
				_tbxCVs[CVs[i]].val(this.Notes[noteIdx][CVs[i]] & MC8CVMask);
				if (0 != (this.Notes[noteIdx][CVs[i]] & MC8MeasueEndMask)) {
					measueEnd = true;
				}
			}
			_tbxGate.val(this.Notes[noteIdx].Gate);
			_tbxStepTime.val(this.Notes[noteIdx].StepTime + 1); // Step time is always 1-256
			_cbxMeasueEnd.attr('checked', measueEnd);
		}
		else {
			// Empty boxes
			for (var i = 0; i < CVs.length; i++) {
				_tbxCVs[CVs[i]].val('');
			}
			_tbxGate.val('');
			_tbxStepTime.val('');
			_cbxMeasueEnd.attr('checked', false);
		}


		// Display notes after
		noteIdx = this.NoteCurrent;
		step = this.NoteCurrentStep;
		for (var i = 0; i < this.config.rowsAfterEdit; i++) {
			step++;

			// Check if note finished
			if (noteIdx < this.Notes.length && this.Notes[noteIdx].StepTime < step) {
				step = 0;
				noteIdx++;
			}

			if (0 == step && noteIdx < this.Notes.length) {
				this.displayNoteRow(_tableRowsAfterEdit[i], this.Notes[noteIdx], CVs);
			}
			else {
				this.displayEmptyRow(_tableRowsAfterEdit[i]);
			}
		}

		// Display notes before
		noteIdx = this.NoteCurrent;
		step = this.NoteCurrentStep;
		for (var i = this.config.rowsBeforeEdit - 1; i >= 0; i--) {
			step--;
			if (step < 0) {
				noteIdx--;
				if (noteIdx >= 0) {
					step = this.Notes[noteIdx].StepTime;
				}
			}

			if (0 == step && noteIdx >= 0) {
				this.displayNoteRow(_tableRowsBeforeEdit[i], this.Notes[noteIdx], CVs);
			}
			else {
				this.displayEmptyRow(_tableRowsBeforeEdit[i]);
			}
		}
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