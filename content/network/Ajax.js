const EXPORTED_SYMBOLS = ['Ajax'];

//https://developer.mozilla.org/en/Storage

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/UTIL.js');
Components.utils.import('chrome://UserJS/content/utils/Timer.js');

/*
(function () {
	let file = Services.dirsvc.get('UChrm', Ci.nsILocalFile);
	file.appendRelativePath('UserLib');
	let UserLibPath = Cc["@mozilla.org/network/protocol;1?name=file"].
					getService(Ci.nsIFileProtocolHandler).
					getURLSpecFromFile(file);		
	Cu.import(UserLibPath + 'require.js');
})();*/

function addRandom (url) {
	let ary = url.split('?'), tmp = '_wgu=' + new Date().valueOf() + '&';
	ary[1] = tmp + (ary[1] || '');
	return ary.join('?');
}

const DEFAULT_OPTIONS = {
	state: 'init',
	listener: {},
	method: 'GET',
	cache: true,
	headers: {},
	body: '',
	timeout: 10000
}

function Ajax (opts) {
	if (!(this instanceof Ajax)) {
		return new Ajax(opts);
	} else {
		this.xhr = this._getXHR();
		this.timer = new Timer();
		this.set(opts);
		let types = ["load","error","progress"];
		let ajax = this; 
		for (let i = 0; i < 3; i++) {
			let type = types[i];
			this.xhr.addEventListener(type, function () {
				if (type == "load" || type == "error") {
					ajax.timer.cancel();
				}
				if (!!ajax.listener[type]) {
					ajax.listener[type].call(ajax);
				}
				/*else {
					ajax.xhr.removeEventListener(type,arguments.callee,true);
				}*/
			}, true);
		}
	}
}

Ajax.prototype = {
	_strToFormData: function (str) {
		var ary = str.split('&'),l=ary.length,fd;
		if (typeof FormData == "undefined") {
			fd = Cc["@mozilla.org/files/formdata;1"]
			.createInstance(Ci.nsIDOMFormData);
		} else {
			fd = new FormData();
		}
		while (l--) {
			var tmp = ary[l].split('='),key = tmp.shift(), val= tmp.join('=');
			if (key.indexOf('wguF-')!=-1) {//file
				fd.append(key.substr(5), UTIL.File(val));
			} else {
				fd.append(key, val);
			}
		}
		return fd;
	},
	_getBody: function (params) {
		//console.log(_toString(params));
		if (_toString(params) == "[object String]") {
			return params;
		} else if (_toString(params) == "[object Object]") {
			let re = [];
			for (var i in params) {
				re.push(i + '=' + params[i]);
			}
			return re.join('&');
		} else { //[]
			let re = [];
			for (let i = 0, len = params.length; i < len; i++) {
				if (_toString(params) == "[object Object]") {
					re.push(arguments.callee(params[i]));
				} else {
					re.push(params[i]);
				}
			}
			return re.join('&');
		}
	},
	_getXHR: function () {
		let xhr = Cc['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance();
		xhr.QueryInterface(Ci.nsIDOMEventTarget);
		xhr.QueryInterface(Ci.nsIXMLHttpRequest);
		/*if (parseInt(UTIL.VERSION,10) >= 14) {
			return UTIL.proxy(xhr);
		} else {
			
		}*/
		return xhr;
	},
	set: function (opts) {
		_extend(this, DEFAULT_OPTIONS, opts);
		return this;
	},
	post: function (ajax) {
		ajax = ajax || this;
		let xhr = ajax.xhr;
		if (!!ajax.listener.create) {
			var re = ajax.listener.create.call(ajax);
			if (re === false) return;
		} 
		ajax.method = ajax.method.toUpperCase();
		if (ajax.method.split('_')[0] == 'GET') {
			xhr.open('GET', (!ajax.cache ? addRandom(ajax.url): ajax.url), true);
		} else {
			xhr.open(ajax.method.split('_')[0], ajax.url, true);
		}
		
		ajax.body = ajax._getBody(ajax.body);//进行简单的参数处理
		if (ajax.outerWindowID) {
			xhr.setRequestHeader('wgu-outerWindowID', ajax.outerWindowID);
		}
		
		for (var i in ajax.headers) {
			xhr.setRequestHeader(i, ajax.headers[i]||' ');
		}

		
		ajax.state = 'post';
		if (ajax.method == "POST") {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(ajax.body);
		} else if (ajax.method == "POST_FILE") {//file支持需要缓存功能'
			xhr.send(ajax._strToFormData(ajax.body));
		} else if (ajax.method == "GET") {
			xhr.send('');
		} else {
			xhr.send(ajax.body);
		}
		
		if (!!ajax.timeout) {
			ajax.timer.setTimeout(ajax.reload, ajax.timeout, ajax);		
		}
		return this;
	},
	reload: function (ajax) {
		ajax = ajax || this;
		ajax.state = 'reload';
		if (!!ajax.listener.reload) {
			if (ajax.listener.reload.call(ajax) == true) {
				return;
			}
		}
		if (ajax.xhr.readyState < 3) {
			ajax.xhr.abort();
			ajax.post();
		}
	}
}