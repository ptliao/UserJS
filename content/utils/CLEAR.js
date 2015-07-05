const EXPORTED_SYMBOLS = [ 'CLEAR' ];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/Prefs.js');
Components.utils.import("resource:///modules/offlineAppCache.jsm");

const phInterface = Ci.nsIPluginHost;
const FLAG_CLEAR_ALL = phInterface.FLAG_CLEAR_ALL;

var CLEAR = {
	cache: function ()  {
		 var cacheService = Cc["@mozilla.org/network/cache-service;1"].
                          getService(Ci.nsICacheService);
        try {
			cacheService.evictEntries(Ci.nsICache.STORE_ANYWHERE);
			cacheService.evictEntries(Ci.nsICache.STORE_ON_DISK);
			cacheService.evictEntries(Ci.nsICache.STORE_IN_MEMORY);
			cacheService.evictEntries(Ci.nsICache.STORE_OFFLINE)
        } catch(er) {}

        var imageCache = Cc["@mozilla.org/image/tools;1"].
							getService(Ci.imgITools).getImgCacheForDocument(null);
        try {
          imageCache.clearCache(false); 
        } catch(er) {}
		return this;
	},
	cookies: function () {
		var cookieMgr = Components.classes["@mozilla.org/cookiemanager;1"]
                                  .getService(Ci.nsICookieManager);
		cookieMgr.removeAll();
		try {
			new Prefs("geo.wifi.access_token.").remove();
        } catch (e) {}
		return this;
	},
	flash: function () {
        let ph = Cc["@mozilla.org/plugin/host;1"].getService(phInterface);
        let age = -1;
        let tags = ph.getPluginTags();
		for (let i = 0; i < tags.length; i++) {
			try {
				ph.clearSiteData(tags[i], null, FLAG_CLEAR_ALL, age);
			} catch (e) {
				if (e.result == Cr.NS_ERROR_PLUGIN_TIME_RANGE_NOT_SUPPORTED) {
					try {
						ph.clearSiteData(tags[i], null, FLAG_CLEAR_ALL, -1);
					} catch (e) {}
				}
			}
		}
		return this;
	},
	offlineApps: function ()  {
        OfflineAppCacheHelper.clear();
		return this;
	},
	history: function () {
        var globalHistory = Cc["@mozilla.org/browser/global-history;2"]
                                      .getService(Ci.nsIBrowserHistory);
        globalHistory.removeAllPages();
        
        try {
          var os = Cc["@mozilla.org/observer-service;1"]
                             .getService(Ci.nsIObserverService);
          os.notifyObservers(null, "browser:purge-session-history", "");
        }
        catch (e) { }

        try {
          new prefs().reset("general.open_location.last_url");
        }
        catch (e) { }
		return this;
    },
	formdata: function () {
		var windowManager = Cc['@mozilla.org/appshell/window-mediator;1']
                                      .getService(Ci.nsIWindowMediator);
        var windows = windowManager.getEnumerator("navigator:browser");
        while (windows.hasMoreElements()) {
			let currentDocument = windows.getNext().document;
			let searchBar = currentDocument.getElementById("searchbar");
			if (searchBar)
				searchBar.textbox.reset();
			let findBar = currentDocument.getElementById("FindToolbar");
			if (findBar)
				findBar.clear();
        }

        let formHistory = Cc["@mozilla.org/satchel/form-history;1"]
                                    .getService(Ci.nsIFormHistory2);
        formHistory.removeAllEntries();
		return this;
	},
	downloads: function () {
        var dlMgr = Cc["@mozilla.org/download-manager;1"]
                              .getService(Ci.nsIDownloadManager);
		var dlsToRemove = [];
		dlMgr.cleanUp();
		dlMgr.cleanUpPrivate();

		for (let dlsEnum of [dlMgr.activeDownloads, dlMgr.activePrivateDownloads]) {
			while (dlsEnum.hasMoreElements()) {
				dlsToRemove.push(dlsEnum.next());
			}
		}
		dlsToRemove.forEach(function (dl) {
			dl.remove();
		});
		return this;
    },
    passwords: function () {
        var pwmgr = Cc["@mozilla.org/login-manager;1"]
                              .getService(Ci.nsILoginManager);
        pwmgr.removeAllLogins();
		return this;
    },
	sessions: function () {
        var sdr = Cc["@mozilla.org/security/sdr;1"]
                            .getService(Ci.nsISecretDecoderRing);
        sdr.logoutAndTeardown();
        var os = Cc["@mozilla.org/observer-service;1"]
                           .getService(Ci.nsIObserverService);
        os.notifyObservers(null, "net:clear-active-logins", null);
		return this;
    },
	siteSettings: function () {
        var pm = Cc["@mozilla.org/permissionmanager;1"].getService(Ci.nsIPermissionManager);
        pm.removeAll();
        
        var cps = Ccs["@mozilla.org/content-pref/service;1"].getService(Ci.nsIContentPrefService);
        cps.removeGroupedPrefs(null);

        var pwmgr = Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager);
        var hosts = pwmgr.getAllDisabledHosts();
		
        for each (var host in hosts) {
			pwmgr.setLoginSavingEnabled(host, true);
        }
		return this;
    },
	localStorage: function () {
		var localStorage = Cc["@mozilla.org/dom/storagemanager;1"].getService(Ci.nsIObserver);
		localStorage.observe(null, "cookie-changed", "cleared");
		return this;
	},
	all: function () {
		for (var i in this) {
			if (i != 'all' && typeof this[i] == 'function') {
				this[i]();
			}
		}
		return this;
	}
}