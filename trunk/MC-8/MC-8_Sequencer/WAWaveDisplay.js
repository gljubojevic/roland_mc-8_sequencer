// Display Wave using web audio

function WAWaveDisplay(canvasId, audioSource) {

	var _canvasId = canvasId;
	var _audioInput = audioSource;
	var _audioAnalizer;

	var _2DContext = null;
	var _width;
	var _height;
	var _animFrame;

	this.init = function () {
	}

	this.render = function () {
		if (!_2DContext) {
			var canvas = document.getElementById(_canvasId);
			_width = canvas.width;
			_height = canvas.height;
			_2DContext = canvas.getContext('2d');
		}

		var waveByteData = new Uint8Array(_width);
		_audioAnalizer.getByteTimeDomainData(waveByteData);

		// TODO: Scale data
		_2DContext.clearRect(0, 0, _audioVisualizeWidth, _audioVisualizeHeight);
		_2DContext.beginPath();
		_2DContext.moveTo(0, waveByteData[0] / 2);
		for (var i = 1; i < waveByteData.length; i++) {
			_2DContext.lineTo(i, waveByteData[i] / 2);
		}
		_2DContext.stroke();

		_animFrame = window.requestAnimationFrame(audioVisualize);
	}

	// Init object;
	this.init();
}