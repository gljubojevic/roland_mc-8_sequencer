function MC8BitStreamEncoder(AudioContext)
{
	// Constants
	var HIFreqHz = 2100;
	var LOFreqHz = 1300;
	var LogicOneHIFreqPeriods = 7;
	var LogicZeroLOFreqPeriods = 4;

	// Block size (1), Address HI, LO (2), Block Bytes (32), Checksum (1), End of block marker (1)
	var MC8ByteBlockSize = 1 + 2 + 32 + 1 + 1;
	var MC8ChecksumBlockPos = 1 + 2 + 32;

	// Duration of leading and trailing signal in sec
	var MC8LeadAndTrailDuration = 10;
	//var MC8LeadAndTrailOnes = MC8LeadAndTrailDuration / (1 / HIFreqHz * LogicOneHIFreqPeriods);

	var audioContext = AudioContext;
	var oscillator = null;
	var oscillatorGain = null;

	this.Encoded = '';

	// Encode bytes to bits LSB first
	this.BitStreamEncodeByte = function(b)
	{
		var byteEncoded = new Array();

		for (var i = 0; i < 8; i++) {

			if (1 == ((b >> i) & 1)) {
				byteEncoded.push(1);
			}
			else {
				byteEncoded.push(0);
			}
		}

		return byteEncoded.join('');
	}

	this.BitStreamEncode = function(dataBytes)
	{
		var bitStream = new Array();

		// Add leading ones
		//bitStream.push(Array(MC8LeadAndTrailOnes).join('1'));
		
		// Add first separator as first byte marker
		bitStream.push('110');

		for (var i = 0; i < dataBytes.length; i++) {
			bitStream.push(this.BitStreamEncodeByte(dataBytes[i]));

			// Add separator bits, when checksum position separator bits are '111' otherwise '110'
			if (MC8ChecksumBlockPos == (i % MC8ByteBlockSize)) {
				bitStream.push('111');
			}
			else {
				bitStream.push('110');
			}
		}

		// Add trailing ones
		//bitStream.push(Array(MC8LeadAndTrailOnes).join('1'));

		// Finaly export bit stream as string
		this.Encoded = bitStream.join('');
	}


	this.StopAudioData = function () {
		// Stop Playback
		if (null != oscillator && 0 != oscillator.playbackState) {
			oscillator.noteOff(0);
		}
	}

	this.PlayAudioData = function () {
		this.StopAudioData();

		// Create oscillator, sine wave, HI freq default
		oscillator = audioContext.createOscillator();
		oscillator.type = 0;
		oscillator.frequency.value = HIFreqHz;
		oscillator.frequency.cancelScheduledValues(0); 	// Clear All previous timed values

		// Create Oscillator gain node
		oscillatorGain = audioContext.createGainNode()
		oscillatorGain.gain.value = 0.8;
		oscillatorGain.gain.cancelScheduledValues(0);	// Clear All previous timed values

		// Connect oscilator and gain output to output
		oscillator.connect(oscillatorGain);
		oscillatorGain.connect(audioContext.destination);

		// Calculate bit 1 and 0 duration
		// NOTE: I might need to add some time because of freq switching
		var oneDuration = 1 / HIFreqHz * (LogicOneHIFreqPeriods + 0.0);
		var zeroDuration = 1 / LOFreqHz * (LogicZeroLOFreqPeriods + 0.0);
		// For test make 0 duration same as 1 duration
		zeroDuration = oneDuration;

		// NOTE: Keep in mind to calculuate everything relative to current time in audio context
		// Get Current time + 1sec in audio context so we can schedule correct freq change
		// Note: 1 sec should be enough time to schedule all values
		var schTime = 1 + audioContext.currentTime;

		// First schedule HI freq for 10 sec for lead freq
		var currentBit = '1';
		oscillator.frequency.setValueAtTime(HIFreqHz, schTime);
		oscillatorGain.gain.setValueAtTime(0.8, schTime);
		schTime += MC8LeadAndTrailDuration;

		// Set all timed freq changes
		for (var i = 0; i < this.Encoded.length; i++) {

			// Check if bit value changed
			if (currentBit != this.Encoded.charAt(i)) {
				currentBit = this.Encoded.charAt(i);

				// Change oscillator freq
				if ('1' == currentBit) {
					oscillator.frequency.setValueAtTime(HIFreqHz, schTime);
					oscillatorGain.gain.setValueAtTime(0.8, schTime);
				}
				else {
					oscillator.frequency.setValueAtTime(LOFreqHz, schTime);
					oscillatorGain.gain.setValueAtTime(1.0, schTime);
				}
			}

			// Just add duration for current bit
			if ('1' == currentBit) {
				schTime += oneDuration;
			}
			else {
				schTime += zeroDuration;
			}
		}

		// Schedule trailing HI freq for 10 sec
		oscillator.frequency.setValueAtTime(HIFreqHz, schTime);
		oscillatorGain.gain.setValueAtTime(0.8, schTime);
		schTime += MC8LeadAndTrailDuration;
		// And switch it off after traling time
		oscillator.frequency.setValueAtTime(0, schTime);

		// Start Playback
		oscillator.noteOn(0);

		// TODO: schedule playback stop
	}
}