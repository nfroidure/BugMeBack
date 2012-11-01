// Wrapping console logs
console={
	'nativeConsole':console,
	'history':[],
	'log':function()
		{
		var message='';
		for(var i=0, j=arguments.length; i<j; i++)
			{
			message+=(message?' ':'')+arguments[i];
			}
		this.history.push(message);
		this.nativeConsole.log.apply(window,arguments);
		}
	};
// Catching error raising
window.onerror = function myErrorHandler(error, url, line) {
	console.history.push(url+' ['+line+']: '+error);
	return false;
	};
// Give back infos when asked
opera.extension.onmessage=function(event) {
	if(event.data.target=='page') // identify is window is focused !
		{
		var consoleLog='';
		console.history.forEach(function(item,index) {
			consoleLog+=(consoleLog?'\n':'')+item;
			});
		var bugreportLink=document.querySelectorAll('link[rel=bugreport]');
		var bugreportPath=(bugreportLink[0]&&bugreportLink[0].hasAttribute('href')?bugreportLink[0].getAttribute('href'):'');
		var base=document.location.protocol+'//'+document.location.host;
		if(bugreportPath)
			{
			if(bugreportPath.indexOf('./')===0)
				bugreportPath=base+bugreportPath.substring(1);
			else if(bugreportPath.indexOf('/')===0)
				bugreportPath=base+bugreportPath;
			else if(bugreportPath.indexOf('http')!==0)
				bugreportPath=base
					+(document.location.pathname.lastIndexOf('/')?document.location.pathname.substring(0,document.location.pathname.lastIndexOf('/')):'')
					+'/'+bugreportPath;
			}
		opera.extension.postMessage({
			'target':'extension',
			'source':'page',
			'infos':{
				'url':document.location.href,
				'console':consoleLog,
				'screen':{
					'width':window.innerWidth,
					'height':window.innerHeight,
					'scrollX':window.scrollX,
					'scrollY':window.scrollY
					},
				'reportUrl':bugreportPath,
				'reportType':(bugreportLink[0]&&bugreportLink[0].hasAttribute('type')
					&&['text/plain','application/json','application/x-www-form-urlencoded','multipart/form-data'].indexOf(bugreportLink[0].getAttribute('type'))?bugreportLink[0].getAttribute('type'):'text/plain')
				}
			});
		}
	};
