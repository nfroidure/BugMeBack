var bugInfo=document.querySelectorAll('meta[name=bugreport]');

chrome.extension.sendRequest({'report':(bugInfo[0]?bugInfo[0].getAttribute('content'):''),
	'screen':'width:'+window.innerWidth+', height:'+window.innerHeight+', scrollX:'+window.scrollX+', scrollY:'+window.scrollY
	,'messages':console.history
	});