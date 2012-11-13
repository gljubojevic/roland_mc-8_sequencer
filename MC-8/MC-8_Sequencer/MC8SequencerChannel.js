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

function MC8SequencerChannel()
{
	// This is bit field, each CV is one bit in assigment
	this.CVAssinged = 0;
	this.Notes = new Array();

	this.NoteCurrent = 0;
	this.NoteCurrentStep = 0;

	this.CVCheckAssigned = function (cv) {
		return 0 != (this.CVAssinged & (1 << cv));
	}

	this.CVAdd = function (cv) {
		this.CVAssinged |= (1 << cv);
	}

	this.CVRem = function (cv) {
		this.CVAssinged |= (1 << cv);
	}

	this.NoteAdd()
	{
	}
}