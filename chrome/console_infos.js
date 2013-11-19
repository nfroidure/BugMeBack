// Wrapping console logs
window.console={
  'nativeConsole':window.console,
  'history':[],
  'log':function() {
    var message='';
    for(var i=0, j=arguments.length; i<j; i++) {
      message+=(message?' ':'')+arguments[i];
    }
    this.history.push(message);
    this.nativeConsole.log.apply(this.nativeConsole, arguments);
  }
};
// Catching error raising
window.addEventListener('error', function myErrorHandler(error, url, line) {
  console.history.push(error.filename+' ['+error.lineno+':'+error.colno+']: '+error.message);
  return false;
});

