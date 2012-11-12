function MC8SequencerChannel()
{
	// This is bit field, each CV is one bit in assigment
	this.CVAssinged = 0;

	this.CV0 = null;
	this.CV1 = null;
	this.CV2 = null;
	this.CV3 = null;
	this.CV4 = null;
	this.CV5 = null;
	this.CV6 = null;
	this.CV7 = null;
	this.StepTime = new Array();
	this.Gate = new Array;

	this.CheckCVAssigned = function (cv)
	{
		return 0 != (this.CVAssinged & (1 << cv));
	}

	this.AssignCV = function (cv)
	{
		// If not assigned create empty array
		if (!this.CVAssinged(cv))
		{

		}
		this.CVAssinged |= (1 << cv);
	}
}