(function() {	
	const userjs = {};
	Components.utils.import('chrome://UserJS/content/require.js',userjs);
	var require = userjs.require;
	require('HTTP_OBSERVER');
	require('COOKIE_MANAGE');
	require('INFO_MANAGE');
	require('OPTS_MANAGE');
	/*
	var Services = userjs.Services;
	Services.console.logStringMessage('Components.interfaces.jsdIDebuggerService');
	var jsd = Components.classes["@mozilla.org/js/jsd/debugger-service;1"]
	.getService(Components.interfaces.jsdIDebuggerService);
	jsd.asyncOn(function () {
		jsd.scriptHook = {
			onScriptCreated: function(script) {
				//Services.console.logStringMessage(script.fileName);
				//Services.console.logStringMessage(script.functionName);
				for (var i in script) {
					Services.console.logStringMessage(script[i]);
				}
				function getParameterNames() {
					[native code]
				}
			},
			onScriptDestroyed: function(script) {
				Services.console.logStringMessage('onScriptDestroyed');
			}
		};
		
		
		jsd.enumerateScripts({
			// the enumerateScript method will be called once for every script JSD knows about
			enumerateScript: function(script) {
				Services.console.logStringMessage('enumerateScript');
			}
		});
		Services.console.logStringMessage('Components.interfaces.jsdIDebuggerService on');
	});
	
	*/
	
})();