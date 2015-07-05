const EXPORTED_SYMBOLS = ['Prefs'];

const  { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
Cu.import("resource://gre/modules/Services.jsm");

const branch = Ci.nsIPrefBranch;
const PREF_INVALID = branch.PREF_INVALID,
	PREF_STRING = branch.PREF_STRING,
	PREF_BOOL = branch.PREF_BOOL,
	PREF_INT = branch.PREF_INT,
	MAX_PREF_VALUE = 0x7FFFFFFF,
	MIN_PREF_VALUE = -0x80000000;

function Prefs(startPoint) {
	if (!(this instanceof Prefs)) {
		/*var obj = Object.create(Prefs.prototype);
		obj.pref = Services.prefs.getBranch(startPoint);
		return obj;*/
		return new Prefs(startPoint);
	} else {
		this.pref = Services.prefs.getBranch(startPoint);
	}
}

Prefs.prototype = {
	get: function (prefName, defaultValue) {
		defaultValue = defaultValue || null;
		var prefType = this.pref.getPrefType(prefName);
		if (prefType == PREF_INVALID) {
			return defaultValue;
		}
		try {
			switch (prefType) {
				case PREF_STRING:
					return this.pref.getComplexValue(prefName, Ci.nsISupportsString).data;
				case PREF_BOOL:
					return this.pref.getBoolPref(prefName);
				case PREF_INT:
					return this.pref.getIntPref(prefName);
			}
		} catch(ex) {
			return defaultValue ;
		}
		return null;
	},
	set: function (prefName, value) {
		var prefType = typeof(value);
		var goodType = false;
		switch (prefType) {
			case "string":
			case "boolean":
				goodType = true;
				break;
			case "number":
				if (value % 1 == 0 && value >= MIN_PREF_VALUE && value <= MAX_PREF_VALUE) {
					goodType = true;
				}
				break;
		}
		if (!goodType) {
		  throw new Error("Unsupported type for Prefs.set . Supported types " +
						  "are: string, bool, and 32 bit integers.");
		}
		
		//if (this.has(prefName) && prefType != typeof(this.get(prefName))) {
			this.remove(prefName);
		//}
		// set new value using correct method
		switch (prefType) {
			case "string":
				let str = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
				str.data = value;
				this.pref.setComplexValue(prefName, Ci.nsISupportsString, str);
				break;
			case "boolean":
				this.pref.setBoolPref(prefName, value);
				break;
			case "number":
				this.pref.setIntPref(prefName, Math.floor(value));
				break;
		}
	},
	has: function (prefName) {
		return this.pref.getPrefType(prefName) != PREF_INVALID;
	},
	isSet: function (prefName) {
		return this.has(prefName) && this.pref.prefHasUserValue(prefName);
	},
	reset: function (prefName) {
		try {
			prefName = prefName || "";
			this.pref.clearUserPref(prefName);
		} catch(e) {
		// The pref service throws NS_ERROR_UNEXPECTED when the caller tries
		// to reset a pref that doesn't exist or is already set to its default
		// value.  This interface fails silently in those cases, so callers
		// can unconditionally reset a pref without having to check if it needs
		// resetting first or trap exceptions after the fact.  It passes through
		// other exceptions, however, so callers know about them, since we don't
		// know what other exceptions might be thrown and what they might mean.
		}
	},
	list: function () {
		return this.pref.getChildList("", {});
	},
	remove: function(prefName) {
		prefName = prefName || '';
		this.pref.deleteBranch(prefName);
	}
}
