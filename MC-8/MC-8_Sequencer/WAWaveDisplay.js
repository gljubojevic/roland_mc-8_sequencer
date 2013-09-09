// Display Wave using web audio
function WAWaveDisplay(canvasId, audioContext) {

	var _self = this;

	var _audioContext = audioContext;
    var _audioInput = null;
    var _audioAnalizer = null;

	var _cancelAnimFrame = null;
	var _requestAnimFrame = null;

	var _canvasId = canvasId;
	var _2DContext = null;
	var _width;
	var _height;
	var _scale;
	var _animFrame;
	var _byteData;

	this.Init = function () {
		_requestAnimFrame = window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame;

		_cancelAnimFrame = window.cancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.mozCancelAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.oCancelAnimationFrame
			|| window.msCancelRequestAnimationFrame
			|| window.msCancelAnimationFrame;

	    if (!_2DContext) {
	        var canvas = document.getElementById(_canvasId);
	        _width = canvas.width;
	        _height = canvas.height;
	        _2DContext = canvas.getContext('2d');

	        _byteData = new Uint8Array(_width);
	        _scale = _height / 255.0;
		}
	}

	this.RenderStart = function (audioInput) {
	    _audioInput = audioInput;
	    _audioAnalizer = _audioContext.createAnalyser();
	    _audioInput.connect(_audioAnalizer);
	    this.Render();
	}

	this.Render = function () {
		_audioAnalizer.getByteTimeDomainData(_byteData);

		_2DContext.clearRect(0, 0, _width, _height);
		_2DContext.beginPath();
		_2DContext.moveTo(0, Math.round(_byteData[0] * _scale));
		for (var i = 1; i < _byteData.length; i++) {
		    _2DContext.lineTo(i, Math.round(_byteData[i] * _scale));
		}
		_2DContext.stroke();

		_animFrame = _requestAnimFrame(_self.Render);
	}

	this.RenderStop = function () {
	    // Stop draw
	    _cancelAnimFrame(_animFrame);
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