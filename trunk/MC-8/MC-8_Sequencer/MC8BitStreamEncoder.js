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
	var MC8LeadAndTrailOnes = MC8LeadAndTrailDuration / (1 / HIFreqHz * LogicOneHIFreqPeriods);

	var audioContext = AudioContext;
	var oscillator = null;

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
		bitStream.push(Array(MC8LeadAndTrailOnes).join('1'));
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
		bitStream.push(Array(MC8LeadAndTrailOnes).join('1'));

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

		// Create oscillator
		oscillator = audioContext.createOscillator();
		// Set oscilator sine wave
		oscillator.type = 0;
		oscillator.frequency.value = HIFreqHz;

		// TODO: Set all timed freq changes
		// NOTE: Keep in mind to calculuate current time
		oscillator.frequency.setValueAtTime(HIFreqHz, audioContext.currentTime + 0);
		oscillator.frequency.setValueAtTime(LOFreqHz, audioContext.currentTime + 1);
		oscillator.frequency.setValueAtTime(0, audioContext.currentTime + 3);

		// Connect oscilator output to output
		oscillator.connect(audioContext.destination);

		// Start Playback
		oscillator.noteOn(0);
	}
}