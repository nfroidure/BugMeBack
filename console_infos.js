window.console={
	'nativeConsole':window.console,
	'history':[],
	'log':function(message)
		{
		this.history.push(arguments);
		this.nativeConsole.log('w:'+message);
		}
	}
console.log('console wrapped');