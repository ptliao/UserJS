const EXPORTED_SYMBOLS = [ 'DIR_UTILS' ];

"use strict";
Components.utils.import('file:///E:/XUL/lib/require.js');

function getPath(aAppID, isObj) {
	aAppID = aAppID || '';
	isObj = isObj || false;
	let file = Cc["@mozilla.org/file/directory_service;1"]
					.getService(Ci.nsIProperties)
					.get(aAppID, Ci.nsIFile);
	if (isObj) {
		if (file.isFile()) {
			var File = require("File");
			return new File(file.path);
		} else if (file.isDirectory()) {
			var Dir = require("Dir");
			return new Dir(file.path);
		}
	} else {
		return file.path;
	}
}
 
const DIR_UTILS ={
	getPath: getPath,
	// C:\Documents and Settings\guw\×ÀÃæ
	DESK_TOP_DIR: (function () {
		try {
			return getPath('Desk');
		} catch(e) {
			return getPath('UsrDsk');
		}
	})(),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles\7hetupm7.default
	PREFS_DIR: getPath("PrefD"),
	// D:\Program Files\Mozilla Firefox\chrome
	CHROME_DIR: getPath("AChrom"),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles
	MOZ_HOME_DIR: getPath("DefProfRt"),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles\7hetupm7.default
	MOZ_USER_HOME_DIR: getPath("ProfD"),
	// Documents and Settings\guw\Application Data\Mozilla\Firefox\registry.dat
	APP_REG_DIR: getPath("AppRegF"),
	// D:\Program Files\Mozilla Firefox\defaults
	App_Default_Dir: getPath("DefRt"),
	// D:\Program Files\Mozilla Firefox\defaults\pref
	APP_DEFAULT_DIR: getPath("PrfDef"),
	// D:\Program Files\Mozilla Firefox\defaults\profile
	PROFILE_DEFAULTS_LOC_DIR: getPath("profDef"),
	// D:\Program Files\Mozilla Firefox\defaults\profile
	PROFILE_DEFAULTS_DIR: getPath("ProfDefNoLoc"),
	// D:\Program Files\Mozilla Firefox\res
	APP_RES_DIR: getPath("ARes"),
	// D:\Program Files\Mozilla Firefox\plugins
	APP_PLUGINS_DIR: getPath("APlugns"),
	// D:\Program Files\Mozilla Firefox\searchplugins
	SEARCH_PLUGINS_DIR: getPath("SrchPlugns"),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles\7hetupm7.default\prefs.js
	PREFS_FILE: getPath("PrefF"),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles\7hetupm7.default\chrome
	USER_CHROME_DIR: getPath("UChrm"),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles\7hetupm7.default\localstore.rdf
	LOCAL_STORE: getPath("LclSt"),

	//HISTORY_FILE: getPath("UHist"),

	//PANELS_FILE: getPath("UPnls"),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles\7hetupm7.default\mimeTypes.rdf
	MIME_TYPES: getPath("UMimTyp"),
	// C:\Documents and Settings\guw\Application Data\Mozilla\Firefox\Profiles\7hetupm7.default\bookmarks.html
	BOOKMARKS: getPath("BMarks"),
	// /root/.mozilla/Default User/k1m30xaf.slt/search.rdf
	SEARCH_FILE: getPath("SrchF"),

	//USER_MAIL_DIR: getPath("MailD"),

	//USER_IMAP_DIR: getPath("IMapMD"),
	
	//USER_NEWS_DIR: getPath("NewsD"),

	//MESSENGER_FOLDER_CACHE: getPath("MFCaD"),
	// D:\Program Files\Mozilla Firefox
	CUR_PROC_DIR: getPath("CurProcD"),
	// C:\Documents and Settings\guw
	HOME_DIR: getPath("Home"),
	// C:\DOCUME~1\GUW~1.SNA\LOCALS~1\Temp
	TMP_DIR: getPath("TmpD")

	//COMPONENTS_DIR: getPath("ComsD")
}