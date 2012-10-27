var bugInfo=document.querySelectorAll('meta[name=bugreport]');


//chrome.experimental.devtools.console.getMessages(function (messages)
//	{
	chrome.extension.sendRequest({'report':(bugInfo[0]?bugInfo[0].getAttribute('content'):''),
		'screen':'width:'+window.innerWidth+', height:'+window.innerHeight+', scrollX:'+window.scrollX+', scrollY:'+window.scrollY
		//,'messages':messages
		});
//	});