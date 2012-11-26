function MC8BitStreamEncoder()
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

	var audioContext = new window.webkitAudioContext(); 	// Create Audio Context
	var oscilator = null;

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
		if (null == oscilator) {
			return;
		}

		// Stop Playback
		alert(oscilator.playbackState);
		if (0 != oscilator.playbackState) {
			oscilator.noteOff(0);
		}
	}

	this.PlayAudioData = function () {

		if (null == oscilator) {
			// Create oscilator
			oscilator = audioContext.createOscillator();
			// Set oscilator sine wave
			oscilator.type = 0;
			oscilator.frequency.value = HIFreqHz;
		}
		else {
			this.StopAudioData();
		}

		// TODO: Set all timed freq changes
		oscilator.frequency.setValueAtTime(HIFreqHz, 0);
		oscilator.frequency.setValueAtTime(LOFreqHz, 1);
		oscilator.frequency.setValueAtTime(0, 3);

		// Connect oscilator output to output
		oscilator.connect(audioContext.destination);

		// Start Playback
		oscilator.noteOn(0);
	}
}