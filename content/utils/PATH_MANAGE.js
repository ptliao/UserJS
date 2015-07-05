const EXPORTED_SYMBOLS = ['PATH_MANAGE'];

/*
	There is a difference between a URI and a URL. 
	A URL describes the location of the resource, the URI describes an id of the resource . 
	A URI may be a location, a URL, or a name, a URN, of a resource.
*/

const { classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
        results: Cr, manager: Cm } = Components;
Cu.import("resource://gre/modules/Services.jsm");

function _toString (obj) {
	return Object.prototype.toString.call(obj);
}

const PATH_MANAGE = {
	set: function (name, value) {
		this.short[name] = value;
		return this;
	},
	del: function () {
		delete this.short[name];
		return this;
	},
	getFull: function (str) {
		let self = this, end = false;
		//Services.console.logStringMessage(str);
		while(!end) { 
			end = true;
			str = str.replace(/^(\w+):\/*/,function (a,a1) {
				//Services.console.logStringMessage(a1);
				if (!!self.short[a1]) {
					end = false;
					return self.short[a1];
				} else {
					end = true;
					return a;
				}
			})
		}
		return str;
	},
	keyToURL: function (aAppID) {
		try {
			let file = Services.dirsvc.get(aAppID, Ci.nsIFile);
			return this.fileToURL(file);
		} catch (e) {
			return null;
		}
	},
	fileToURL: function (file) {
		return Cc["@mozilla.org/network/protocol;1?name=file"].
						getService(Ci.nsIFileProtocolHandler).
						getURLSpecFromFile(file);
	},
	pathToURL: function (path) {
		path = getFull(path);
		let file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(path);
		return this.fileToURL(file);
	},
	urlToPath: function (url) {
		url = this.getFull(url);
		if (/^chrome:/i.test(url)) {
			url = this.chromeToURL(url);
		}
		return Cc["@mozilla.org/network/protocol;1?name=file"].
					getService(Ci.nsIFileProtocolHandler).
					getFileFromURLSpec(url).
					path;
	},
	chromeToURL: function (path) {
		path = this.getFull(path);
		try {
			let ioservice = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
			let uri = ioservice.newURI(path, "UTF-8", null);
			
			let chromeRegistry = Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIChromeRegistry);
			
			let rv = chromeRegistry.convertChromeURL(uri);
			
			if (_toString(rv) != "[object String]") {
				rv = chromeRegistry.convertChromeURL(uri).spec;
			}
			return rv;
		} catch (e) {
			Cu.reportError(e.message);
			return '';
		}	
	}
	
	/*
	chromeToPath: function (aPath) {
		try {
			let rv = this.chromeToURL(aPath);
			if( rv == ''){
				return '';
			}
			// preserve the zip entry path "!/browser/content/browser.xul"
			// because urlToPath will flip the "/" on Windows to "\"
			let jarPath = "";
			if (/jar:/.test(rv)) {
				rv = rv.replace(/jar:/, "");
				let split = rv.split("!");
				rv = split[0];
				jarPath = "!" + split[1];
			}
			
			if (/resource:/.test(rv)) {
				rv = rv.replace(/.*resource:/, getPath('CurProcD'));
			}

			return this.urlToPath(rv) + jarPath;
		} catch (e) {
			Cu.reportError(e.message);
			return '';
		}
    }*/
};

PATH_MANAGE.short = {};

['Desk','UsrDsk',"PrefD","AChrom","DefProfRt","Home",
	"ProfD","AppRegF","DefRt","PrfDef","profDef","CurProcD",
	"ProfDefNoLoc","ARes","APlugns","SrchPlugns",
	"PrefF","PrefF","UChrm","UMimTyp","LclSt","BMarks",
	"SrchF","MailD","IMapMD","NewsD","MFCaD","TmpD"].forEach(function (v) {
		let tmp = PATH_MANAGE.keyToURL(v);
		if (tmp != null) {
			PATH_MANAGE.short[v] = tmp;
		}	
})

