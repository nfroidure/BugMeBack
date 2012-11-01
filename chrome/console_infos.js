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
	console.nativeConsole.log(arguments);
	console.history.push(url+' ['+line+']: '+error);
	return false;
	};