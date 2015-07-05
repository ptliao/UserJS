const EXPORTED_SYMBOLS = ['COOKIES'];

Components.utils.import('chrome://UserJS/content/require.js');

/*
(function () {
	let file = Services.dirsvc.get('UChrm', Ci.nsILocalFile);
	file.appendRelativePath('UserLib');
	let UserLibPath = Cc["@mozilla.org/network/protocol;1?name=file"].
					getService(Ci.nsIFileProtocolHandler).
					getURLSpecFromFile(file);		
	Cu.import(UserLibPath + 'require.js');
})();*/
/*
pk:{
	'host/psth':{
		'name':value,
		'name1':value
	}
}
*/

const COOKIE_SERVICE = Services.cookies;
const COOKIES = {
	doFn: function (hostPath, obj) {
		let enumerator = COOKIE_SERVICE.enumerator;
		if (hostPath[0] != '.') {
			hostPath = '.' + hostPath;
		}
		if (hostPath[hostPath.length - 1] != '/'){
			hostPath += '/';
		}
		while (enumerator.hasMoreElements()) {
			let nextCookie = enumerator.getNext().QueryInterface(Ci.nsICookie);
			let _host = nextCookie.host, _path = nextCookie.path, _name = nextCookie.name;
			let _hostPath = _host + _path;
			if (_hostPath[0] != '.') {
				_hostPath = '.' + _hostPath;
			}
			if (_hostPath[_hostPath.length - 1] != '/'){
				_hostPath += '/';
			}
			if (_hostPath.indexOf(hostPath) != -1 ) {
				if (obj.loop(_host, _path, _name , nextCookie.value) == true) {
					break;
				}
			}
		}
		return obj.re;
	},
	getOne: function (hostPath, name) {
		return this.doFn(hostPath, {
			re: '',
			loop: function (_host, _path, _name , _value) {
				if (name == _name) {
					this.re = _value;
					return true;
				}
			}
		});
	},
	add: function (hostPath, str) {
		let cks = str.split('; '), tmp = hostPath.split('/');
		let host = tmp.shift(), path = '/' + tmp.join('/');
		for (let i = 0, len = cks.length; i < len; i++) {
			let tmp = cks[i].split('=');
			if (tmp.length >= 2) {
				COOKIE_SERVICE.add(host,path,tmp.shift(),tmp.join('='),false,false,false,Math.round((new Date()).getTime() / 1000 + 9999999999));
			}
		}
	},
	get: function (hostPath) {
		return this.doFn(hostPath, {
			re: [],
			loop: function (_host, _path, _name , _value) {
				this.re.push(_name + '=' + _value);
			}
		}).join('; ');
	},
	remove: function (hostPath) {
		this.doFn(hostPath, {
			re: [],
			loop: function (_host, _path, _name , _value) {
				COOKIE_SERVICE.remove(_host, _name, _path, false);
			}
		});
		return this;
	},
	list: function () {
		var enumerator = COOKIE_SERVICE.enumerator,a=[];
		while (enumerator.hasMoreElements()) {
			let nextCookie = enumerator.getNext();
			nextCookie = nextCookie.QueryInterface(Ci.nsICookie);
			a.push(nextCookie.host+':'+nextCookie.path+':'+nextCookie.name+'='+nextCookie.value+';');
		}
		return a;
	},
	getHost: function (host) {
		if (host[0] != '.') {
			host = '.' + host;
		}
		let enumerator = COOKIE_SERVICE.enumerator, re = {};
		while (enumerator.hasMoreElements()) {
			let nextCookie = enumerator.getNext().QueryInterface(Ci.nsICookie);
			let _h = nextCookie.host;
			if (_h[0] != '.') {
				_h = '.' + _h;
			}
			if (host.indexOf(_h) != -1) {
				let key= nextCookie.host + nextCookie.path;
				re[key] = re[key] || [];
				re[key].push(nextCookie.name + '=' +nextCookie.value);
			}
		}
		for (var key in re) {
			re[key] = re[key].join('; ')
		}
		return re;	
	},
	removeHost: function (host) {
		if (host[0] != '.') {
			host = '.' + host;
		}
		let enumerator = COOKIE_SERVICE.enumerator, re = {};
		while (enumerator.hasMoreElements()) {
			let nextCookie = enumerator.getNext().QueryInterface(Ci.nsICookie);
			let _h = nextCookie.host;
			if (_h[0] != '.') {
				_h = '.' + _h;
			}
			if (host.indexOf(_h) != -1) {
				COOKIE_SERVICE.remove(nextCookie.host, nextCookie.name, nextCookie.path, false);
			}
		}
		return this;
	},
	clear: function (){
		COOKIE_SERVICE.removeAll();
		return this;
	}
}