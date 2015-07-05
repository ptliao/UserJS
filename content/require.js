const EXPORTED_SYMBOLS = ['require', 'requireService', 'console', 'Services', 'Cc', 'CC', 'Ci', 'Cu', 'Cr', 'Cm', '_toString', '_extend'];

const { classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
        results: Cr, manager: Cm } = Components;
		
Cu.import("resource://gre/modules/Services.jsm");
Cu.import('chrome://UserJS/content/utils/PATH_MANAGE.js');

const NAME_REG = /[^:]+$/;
const FILR_REG = /[^\.]+(?=\.jsm?$)/;

var hasOwn = Object.prototype.hasOwnProperty;
function _toString (obj) {
	return Object.prototype.toString.call(obj);
}

function _extend () {
	var deep = false, 
		target = arguments[0] || {}, 
		i = 1,
		len = arguments.length,
		name, obj, copy, src, clone;
	if (typeof target === "boolean") {
		deep = arguments[0];
		target = arguments[1] || {};
		i = 2;
	}
	for ( ; i < len; i++ ) {
		obj = arguments[ i ];
		for (name in obj) {
			if (hasOwn.call(obj, name) == true) { 
				copy = obj[ name ];
				src = target[ name ];
				if (typeof copy == 'undefined') {
					continue;
				}
				if (deep == false) {
					target[ name ] = copy;
				} else {
					if (_toString(copy) == "[object Object]" ) {
						clone =  src && _toString(src) == "[object Object]" ? src : {}
						target[ name ] = _extend(true, clone, copy);
					} else if (_toString(copy) ==  "[object Array]") {
						clone =  src && _toString(src) == "[object Array]" ? src : []
						target[ name ] = _extend(true, clone, copy);
					} else {
						target[ name ] = copy;
					}
				}
			}
		}
	}
	return target;
};


function readURI(uri) {
	let ioservice = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	let channel = ioservice.newChannel(uri, "UTF-8", null);
	let stream = channel.open();

	let cstream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);  
	cstream.init(stream, "UTF-8", 0, 0);

	let str = {}, data = "", read = 0;
	do {
		read = cstream.readString(0xffffffff, str);
		data += str.value;
	} while (read != 0);
	cstream.close();
	
	return data;
}


const console = {
	isDebug: true,
	log: function (str) {
		Services.console.logStringMessage(str);
	},
	debug: function (str) {
		if (this.isDebug) {
			this.log(str);
		}
	}
}


/*
const USER_LIB_URI = (function () {
	try {
		throw new Error('');
	} catch (e) {
		return e.fileName.replace(/require\.js$/, "");
	}
})();

Cu.import(USER_LIB_URI+'utils/PATH_MANAGE.js');
*/


const requireService = {
	path: {},
	load: function (filePath) {
		let options;
		if (_toString(filePath) == "[object Object]") {
			options = filePath;
		} else {
			try {
				options = JSON.parse(filePath)
			} catch(e) {
				options = JSON.parse(readURI(filePath));
			}
		}
		_extend(PATH_MANAGE.short, options.short);
		_extend(this.path, options.path);
		return this;
	},
	getKey: function (name) {
		if (this.path[name]) {
			return name.match(NAME_REG)[0];
		} else {
			return name.match(FILR_REG)[0];
		}
	},
	getFullPath: function (name) {
		return PATH_MANAGE.getFull(this.path[name] || name);
	},
	setPath: function (name, value) {
		this.path[name] = value;
		return this;
	},
	setShort: function (name, value) {
		PATH_MANAGE.set(name, value);
		return this;
	},
	delPath: function (name) {
		delete this.path[name];
		return this;
	},
	delShort: function (name) {
		PATH_MANAGE.del(name);
		return this;
	}
}

function require(name, obj) {
	obj = obj || {};
	console.log("require: " + name + '@' + requireService.getFullPath(name));
	Components.utils.import(requireService.getFullPath(name), obj);
	return obj[requireService.getKey(name)];
}

requireService.load('chrome://UserJS/content/options.json');
//console.log(PATH_MANAGE.getFull('chrome://UserJS/content/options.json'));
//requireService.load(USER_LIB_URI + 'options.json');	