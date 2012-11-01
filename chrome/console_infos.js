// Wrapping console logs
window.console={
	'nativeConsole':window.console,
	'history':[],
	'log':function()
		{
		this.history.push(arguments);
		this.nativeConsole.log(arguments);
		}
	}
// Catching error raising
window.onerror = function myErrorHandler() {
	console.history.push(arguments);
	return false;
	}