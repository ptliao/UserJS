const EXPORTED_SYMBOLS = [ 'FILE_UTILS' ];

"use strict";
Components.utils.import('file:///E:/XUL/lib/require.js');

								
const JS_FILEUTILS_nsIFile = new CC("@mozilla.org/file/local;1","nsILocalFile","initWithPath");

function getType(value) {
	return Object.prototype.toString.call(value);
}

include('DIR_UTILS');

const FILE_UTILS = {
	chromeToURL: function (aPath) {
		if (!aPath) {
			Cu.reportError('NS_ERROR_INVALID_ARG')
		}
		var rv;
		try {
			let ioservice = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
			let uri = ioservice.newURI(aPath, "UTF-8", null);
			
			let chromeRegistry = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIChromeRegistry);
			
			rv = chromeRegistry.convertChromeURL(uri);
			
			if (getType(rv) != "[object String]")
				rv = chromeRegistry.convertChromeURL(uri).spec;
		} catch (e) { 
			throw e ;
			rv = "";
		}
		return rv;
	},
	chromeToPath: function (aPath) {
		if (!aPath) {
			Cu.reportError('NS_ERROR_INVALID_ARG')
		}
		try {
			let rv = this.chromeToURL(aPath);
			
			// preserve the zip entry path "!/browser/content/browser.xul"
			// because urlToPath will flip the "/" on Windows to "\"
			var jarPath = "";
			if (/jar:/.test(rv)) {
				rv = rv.replace(/jar:/, "");
				let split = rv.split("!");
				rv = split[0];
				jarPath = "!" + split[1];
			}

			if (/resource:/.test(rv)) {
				rv = rv.replace(/.*resource:/, DIR_UTILS.CUR_PROC_DIR);
			}

			if (/^file:/.test(rv)) {
				rv = this.urlToPath(rv);
			} else {
				rv = this.urlToPath("file://" + rv);
			}
			rv += jarPath;
		} catch (e) { 
			jslibError(e); 
			rv = "";
		}
		return rv;
    },
	urlToPath: function (aPath) {
		if (!aPath) {
			Cu.reportError('NS_ERROR_INVALID_ARG')
		}
		if ( !/^file:/.test(aPath) ) {
			return jslibErrorMsg("FILE_UTILS.urlToPath arguments[0] must file:");
		}
		var rv;
		try {
			let fileHandler = Cc["@mozilla.org/network/protocol;1?name=file"].getService(Ci.nsIFileProtocolHandler);
			rv = fileHandler.getFileFromURLSpec(aPath).path;
		} catch (e) { 
			jslibError(e); 
			rv = "";
		}
		return rv;
	},
	pathToURL: function (aPath) {
		if (!aPath) {
			Cu.reportError('NS_ERROR_INVALID_ARG')
		}
		var rv;
		try {
			let fileHandler = Cc["@mozilla.org/network/protocol;1?name=file"].getService(Ci.nsIFileProtocolHandler);
			rv = fileHandler.getURLSpecFromFile(this.nsIFile(aPath));
		} catch (e) { 
			jslibError(e); 
			rv = "";
		}
		return rv;
    },
	exists: function (aPath) {
		if (!aPath) {
			Cu.reportError('NS_ERROR_INVALID_ARG')
		}
		var rv;
		try { 
			rv = ( new JS_FILEUTILS_nsIFile(aPath) ).exists(); 
		} catch (e) { 
			rv = false; 
			jslibError(e); 
		}
		return rv;
	}
	remove: function (aPath) {
		if (!aPath) {
			Cu.reportError('NS_ERROR_INVALID_ARG');
		}
		if (!this.exists(aPath)) {
			Cu.reportError("NS_ERROR_FILE_TARGET_DOES_NOT_EXIST");
		}

		var rv;
		try { 
			var fileInst = new JS_FILEUTILS_nsIFile(aPath);

			if (fileInst.isDirectory()) {
				return jslibErrorMsg("NS_ERROR_FILE_IS_DIRECTORY");
			}

			fileInst.remove(false);
			rv = JS_LIB_OK;
		} catch (e) { 
			rv = jslibError(e); 
		}
		return rv;
    },
	copy : function (aSource, aDest) {
		if (!aSource || !aDest) {
			Cu.reportError('NS_ERROR_INVALID_ARG');
		}

		if ( !this.exists(aSource) ) {
			return jslibErrorMsg("NS_ERROR_UNEXPECTED");
		}

		var rv;
		try { 
			var fileInst = new JS_FILEUTILS_nsIFile(aSource);
			var dir      = new JS_FILEUTILS_nsIFile(aDest);
			var copyName = fileInst.leafName;

			if (fileInst.isDirectory()) {
				return jslibErrorMsg("NS_ERROR_FILE_IS_DIRECTORY");
			}
			if (!this.exists(aDest) || !dir.isDirectory()) {
				copyName = dir.leafName;
				dir = new JS_FILEUTILS_nsIFile(dir.path.replace(copyName,''));

				if (!this.exists(dir.path)) {
					return jslibErrorMsg("NS_ERROR_FILE_ALREADY_EXISTS");
				}

				if (!dir.isDirectory()) {
					return jslibErrorMsg("NS_ERROR_FILE_INVALID_PATH");
				}
			}

			if (this.exists(this.append(dir.path, copyName))) {
				return jslibError("NS_ERROR_FILE_ALREADY_EXISTS");
			}

			fileInst.copyTo(dir, copyName);
			rv = jslibRes.NS_OK;
		} catch (e) {
			return jslibError(e);
		}
		return rv;
	},
	leaf: function (aPath) {
		if (!aPath) {
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");
		}
		var rv;
		try {
			var fileInst = new JS_FILEUTILS_nsIFile(aPath);
			rv = fileInst.leafName;
		} catch (e) { 
			return jslibError(e); 
		}
		return rv;
    },
	append: function (aDirPath, aFileName) {
		if (!aDirPath || !aFileName) {
			jslibErrorMsg("NS_ERROR_INVALID_ARG");
		}


		if (!this.exists(aDirPath)) {
			return jslibErrorMsg("NS_ERROR_FILE_NOT_FOUND");
		}
		var rv;
		try { 
			var fileInst = new JS_FILEUTILS_nsIFile(aDirPath);
			if (fileInst.exists() && !fileInst.isDirectory()) 
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

			fileInst.append(aFileName);
			rv = fileInst.path;
			delete fileInst;
		} catch (e) { 
			return jslibError(e); 
		}

		return rv;
    },
	validatePermissions: function(aNum) {
		if ( parseInt(aNum.toString(10).length) < 3 ) {
			return false;
		}
		return true;
    },
    permissions: function (aPath) {
		if (!aPath) {
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");
		}

		if (!this.exists(aPath)) {
			return jslibErrorMsg("NS_ERROR_FILE_NOT_FOUND");
		}
		var rv;
		try { 
			rv = (new JS_FILEUTILS_nsIFile(aPath)).permissions.toString(8);
		} catch (e) { 
			rv = jslibError(e); 
		}
		return rv;
    },
    dateModified: function (aPath) {
		if (!aPath)
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		if (!this.exists(aPath)) 
			jslibErrorMsg("NS_ERROR_FILE_NOT_FOUND");

		var rv;
		try { 
			rv = new Date((new JS_FILEUTILS_nsIFile(aPath)).lastModifiedTime).toLocaleString();
		} catch (e) { 
			rv = jslibError(e); 
		}
		return rv;
    },
	size: function (aPath) {
		if (!aPath)
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		if (!this.exists(aPath)) 
			return jslibErrorMsg("NS_ERROR_FILE_NOT_FOUND");

		var rv = 0;
		try { 
			rv = (new JS_FILEUTILS_nsIFile(aPath)).fileSize;
		} catch (e) { 	
			jslibError(e); 
		}

		return rv;
	},
	ext: function (aPath) {
		if (!aPath) 
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		if (!this.exists(aPath)) 
			return jslibErrorMsg("NS_ERROR_FILE_NOT_FOUND");

		var rv;
		try { 
			var leafName  = (new JS_FILEUTILS_nsIFile(aPath)).leafName;
			var dotIndex  = leafName.lastIndexOf('.'); 
			rv = (dotIndex >= 0) ? leafName.substring(dotIndex+1) : ""; 
		} catch (e) { 
			return jslibError(e);
		}

		return rv;
	},
	parent: function (aPath) {
		if (!aPath)
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		var rv;
		try { 
			var fileInst = new JS_FILEUTILS_nsIFile(aPath);

			if (!fileInst.exists()) {
				return jslibErrorMsg("NS_ERROR_FILE_NOT_FOUND");
			}
			if (fileInst.isFile()) {
				rv = fileInst.parent.path;
			} else if (fileInst.isDirectory()) {
				rv = fileInst.path;
			} else {
				rv = null;
			}
		} catch (e) {
			rv = jslibError(e);
		}
		return rv;
	},

	/**
	* RUN 
	* Trys to execute the requested file as a separate 
	* *non-blocking* process.
	* Passes the supplied *array* of arguments on the command line if
	* the OS supports it.
	*
	*/
	run: function (aPath, aArgs, aBlocking) {
		if (!aPath) 
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		if (!this.exists(aPath)) 
			return jslibErrorMsg("NS_ERROR_FILE_TARGET_DOES_NOT_EXIST");

		var len = 0;
		if (aArgs) {
			len = aArgs.length;
		} else {	
			aArgs = null;
		}

		var rv;
		try { 
			var fileInst = new JS_FILEUTILS_nsIFile(aPath);

			// XXX commenting out this check as it fails on OSX 
			// if (!fileInst.isExecutable()) 
			// return jslibErrorMsg("NS_ERROR_INVALID_ARG");

			if (fileInst.isDirectory()) {
				return jslibErrorMsg("NS_ERROR_FILE_IS_DIRECTORY");
			}

			/** 
			* Create and execute the process ...
			*
			* NOTE: The first argument of the process instance's 'run' method
			*       below specifies the blocking state (false = non-blocking).
			*       The last argument, in theory, contains the process ID (PID)
			*       on return if a variable is supplied--not sure how to implement
			*       this with JavaScript though.
			*/
			try {
				let fileHandler = 
				var theProcess = Cc["@mozilla.org/process/util;1"].getService(Ci.nsIProcess);
							 
				theProcess.init(fileInst);

				var blocking = (aBlocking != undefined);

				rv = theProcess.run(blocking, aArgs, len);
			} catch (e) { 
				rv = jslibError(e); 
			}
		} catch (e) { 
			rv = jslibError(e); 
		}
		return rv;
	},
	create: function (aPath) {
		if (!aPath) 
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		var rv;
		try {
			var f = new JS_FILEUTILS_nsIFile(aPath);
			f.create(f.NORMAL_FILE_TYPE, 0644);
			rv = JS_LIB_OK;
		} catch (e) {
			rv = jslibError(e); 
		}
		return rv;
	},
	isValidPath: function (aPath) {
		if (!aPath) 
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		var rv = true;
		try {
			var f = new JS_FILEUTILS_nsIFile(aPath);
		} catch (e) {
			rv = false; jslibError(e); 
		}
		return rv;
	},
	nsIFile: function (aPath) {
		if (!aPath) 
			return jslibErrorMsg("NS_ERROR_INVALID_ARG");

		var rv;
		try {
			rv = new JS_FILEUTILS_nsIFile(aPath);
		} catch (e) { 
			rv = jslibError(e); 
		}
		return rv;
	}
}