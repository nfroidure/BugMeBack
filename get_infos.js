var bugInfo=document.querySelectorAll('link[rel=bugreport]');

chrome.extension.sendRequest({'report':(bugInfo[0]&&bugInfo[0].hasAttribute('href')?bugInfo[0].getAttribute('href'):''),
	'reportType':(bugInfo[0]&&bugInfo[0].hasAttribute('type')?bugInfo[0].getAttribute('type'):''),
	'screen':'width:'+window.innerWidth+', height:'+window.innerHeight+', scrollX:'+window.scrollX+', scrollY:'+window.scrollY
	,'messages':console.history
	});