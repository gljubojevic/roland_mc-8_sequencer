// http: //airtightinteractive.com/demos/js/reactive/
// http: //uglyhack.appspot.com/webaudiotoy/

// Declare analyzer object
function MC8Analyzer()
{
	var _anaylzer = this;

	var logId;
	var audioContext = new window.webkitAudioContext();	// Create Audio Context
	var source;

	this.Log = function (msg, e)
	{
		$(logId).append(msg + "<br/>");
		if (null != e)
		{	console.log(e);	}
	}

	this.createAudio = function()
	{
		//processor = audioContext.createJavaScriptNode(2048, 1, 1);
		//analyser = audioContext.createAnalyser();

		source.connect(audioContext.destination);
		//source.connect(analyser);

		//analyser.connect(processor);
		//processor.connect(audioContext.destination);

		source.noteOn(0);
	}

	this.playAudio = function ()
	{
		source.noteOn(0);
	}

	this.initAudio = function (data)
	{
		source = audioContext.createBufferSource();

		if (audioContext.decodeAudioData)
		{
			audioContext.decodeAudioData(data, function (buffer)
			{
				source.buffer = buffer;
				_anaylzer.createAudio();
			},
			function (e)
			{
				_anaylzer.Log("cannot decode mp3", e);
			});
		}
		else
		{
			source.buffer = audioContext.createBuffer(data, false);
			_anaylzer.createAudio();
		}
	}

	this.LoadProgram = function (file, audioContainerId)
	{
		var reader = new FileReader();

//		reader.onloadend = function (evt)
//		{
//			if (evt.target.readyState == FileReader.DONE)
//			{
//				$(audioContainerId).append('<audio src="' + evt.target.result + '" controls></audio>');
//			}
//		};
//		reader.readAsDataURL(file);

		reader.onload = function (evt)
		{
			_anaylzer.initAudio(evt.target.result); 	
		};

		reader.readAsArrayBuffer(file);
	}

	// Init and attach
	this.Init = function (inputFile, audioContainerId)
	{
		$(inputFile).change(function ()
		{
			_anaylzer.LoadProgram(this.files[0], audioContainerId);
		});
	}
}
