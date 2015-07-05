const EXPORTED_SYMBOLS = ['PROXY_OBSERVER'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/UTIL.js');

const proxyService = Cc['@mozilla.org/network/protocol-proxy-service;1'].getService(Ci.nsIProtocolProxyService);

const PROXY_REG = /^([^:]+):\/+([^:]+)(?:$|:(\d+)$)/;
function str2Proxy (str) {
	var match = str.match(PROXY_REG);
	if (!match) {
		return directProxy;
	} else {
		match[3] || (match[3] = '80');
		return proxyService.newProxyInfo(match[1], match[2], match[3], 1, 0, null);
	}
};
const directProxy = proxyService.newProxyInfo('direct', '', -1, 0, 0, null);
const proxyFilter = {
	applyFilter: function(proxyService, URI, aProxy){
		var aUrl = URI.asciiSpec, config = PROXY_OBSERVER.config;
		var list = config.list;
		for (let i = 0, len = list.length; i < len; i++) {
			let url = list[i], tmp = config[url];
			if ( url == aUrl || tmp['reg'].test(aUrl)) {
				if (!!tmp.proxy) {
					return tmp.proxy;
				} else {
					tmp.proxy = str2Proxy(tmp.proxyStr);
					return tmp.proxy;
				}
			}
		}
		return null;
	}
}
const PROXY_OBSERVER={
	init: false,
	maxWeight: 0,
	config: {
		list: []
	},
	register: function() {
		if (this.init == false) {
			this.init = true;
			proxyService.registerFilter(proxyFilter, 0);
		}
	},
	unregister: function() {
		proxyService.unregisterFilter(proxyFilter);
		this.init = false;
	},
	add: function (url, proxyStr, weight) {
		weight = weight || 0;
		if (weight > this.maxWeight) {
			this.maxWeight = weight;
		}
		
		let config = this.config;
		config[url] = config[url] || {};
		config[url]['reg'] = UTIL.parseRegExp(url);
		config[url]['weight'] = weight;
		config[url]['proxyStr'] = proxyStr;

		
		let index = config['list'].indexOf(url);
		if (index != -1) {
			config['list'].splice(index, 1);
		}
		for (var i = 0, len = config['list'].length; i < len; i++) {
			if (config[config['list'][i]].weight > weight){
				break;
			}
		}
		config['list'].splice(i, 0, url);
		return this;
	},
	del: function (url) {
		delete this.config[url];
		let list = this.config['list'];
		let index = list.indexOf(url);
		if (index != -1) {
			list.splice(index, 1);
		}
		return this;
	},
	clear: function () {
		delete this.config;
		this.config = {list: []};
		return this;
	}
};
PROXY_OBSERVER.register();
//gw.require('PROXY_OBSERVER').add('http://g_legu2009.cnodejs.net/', 'http://122.72.120.63:80');