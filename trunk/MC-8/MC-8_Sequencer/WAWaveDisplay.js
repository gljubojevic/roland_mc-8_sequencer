// Display Wave using web audio

function WAWaveDisplay(canvasId, audioContext) {

    var _audioContext = audioContext;
    var _audioInput = null;
    var _audioAnalizer = null;

	var _cancelAnimationFrame = null;
	var _requestAnimationFrame = null;

	var _canvasId = canvasId;
	var _2DContext = null;
	var _width;
	var _height;
	var _scale;
	var _animFrame;

	this.Init = function () {
	    if (!_cancelAnimationFrame) {
	        _cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
	    }

	    if (!_requestAnimationFrame) {
	        _requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
	    }

	    if (!_2DContext) {
	        var canvas = document.getElementById(_canvasId);
	        _width = canvas.width;
	        _height = canvas.height;
	        _scale = 255.0 / _height;
	        _2DContext = canvas.getContext('2d');
        }
	}

	this.RenderStart = function (audioInput) {

	    _audioInput = audioInput;
	    _audioAnalizer = _audioContext.createAnalyser();
	    _audioInput.connect(_audioAnalizer);

	    this.Render();
	}

	this.Render = function () {
	    var byteData = new Uint8Array(_width);
		_audioAnalizer.getByteTimeDomainData(byteData);

		_2DContext.clearRect(0, 0, _width, _height);
		_2DContext.beginPath();
		_2DContext.moveTo(0, Math.round(byteData[0] * _scale));
		for (var i = 1; i < byteData.length; i++) {
		    _2DContext.lineTo(i, Math.round(byteData[i] * _scale));
		}
		_2DContext.stroke();

		_animFrame = _requestAnimationFrame(Render);
	}

	this.RenderStop = function () {
	    // Stop draw
	    _cancelAnimationFrame(_animFrame);
	    _animFrame = null;
	    // Clear draw
	    _2DContext.clearRect(0, 0, _width, _height);

	    // Stop Audio
	    _audioInput.disconnect();
	    _audioInput = null;
	    _audioAnalizer = null;
	}

	// Init object;
	this.Init();
}