//--chm reader 
var path = encodeURI(fp.file.path);
getBrowser().loadURI("chm:file://" + path);

//--nsIZipReader
//open zip file

//--str2PDF 
//send XHR to http://pdfcrowd.com/

//--alow javascript
//https://developer.mozilla.org/en-US/docs/Midas/Security_preferences

//DNS
 getDnsCacheValues: function() {
    this.expiration = this.prefs.getIntPref("network.dnsCacheExpiration");
    this.entries = this.prefs.getIntPref("network.dnsCacheEntries");
  },
  //监听打开
  flushDns: function() {
    var networkIoService = Components.classes["@mozilla.org/network/io-service;1"]
        .getService(Components.interfaces.nsIIOService);
    networkIoService.offline = true;
    var cacheService = Components.classes["@mozilla.org/network/cache-service;1"]
        .getService(Components.interfaces.nsICacheService);
    cacheService.evictEntries(Components.interfaces.nsICache.STORE_ANYWHERE);
    networkIoService.offline = false;
  },
  
//-- chromeWork js-ctypes
//resource://gre/modules/osfile/*

//-- 加密
//resource://gre/modules/services-crypto/utils.js

//-- js-ctypes
//resource://gre/modules/services-crypto/WeaveCrypto.js

//-- socket
//resource://gre/modules/services-sync/jpakeclient.js
//resource://gre/components/GPSDGeolocationProvider.js
//resource://gre/components/TCPSocket.js

//-- promise
//resource://gre/modules/commonjs/promise/core.js

//-- 颜色相关
//resource://gre/modules/ColorAnalyzer_worker.js

//-- task.js
//resource://gre/modules/task.jsm

//-- Sqlite.jsm
//resource://gre/modules/Sqlite.jsm

//-- edit
//resource://gre/modules/source-editor.jsm

//-- IE相关
//resource://gre/components/IEProfileMigrator.js

//-- wifi
//resource://gre/components/NetworkGeolocationProvider.js

//--clearCache
//resource://gre/browser/content/browser/sanitize.js