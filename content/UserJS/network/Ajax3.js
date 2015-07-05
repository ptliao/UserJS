const EXPORTED_SYMBOLS = ['Ajax3'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/UTIL.js');
Components.utils.import('chrome://UserJS/content/utils/Timer.js');
Components.utils.import('chrome://UserJS/content/UserJS/network/COOKIE_MANAGE.js');


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

function Ajax3 (opts) {
	if (!(this instanceof Ajax3)) {
		return new Ajax3(opts);
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
				let opts = ajax.opts;
				if (!!opts.listener[type]) {
					if (type == "load") {
						let xhr = ajax.xhr;
						if (xhr.readyState==4) {
							var ck = xhr.getResponseHeader('wguG-Set-Cookie');
							if (!!ck) {
								COOKIE_MANAGE.setCookie(ck, opts.appKey, opts.userInfo.userId, opts.url);
							}
							opts.listener["load"].call(ajax);
						} else {
							opts.listener["error"].call(ajax);
						}
					} else {
						opts.listener[type].call(ajax);
					}
				}
			}, true);
		}
	}
}

Ajax3.prototype = {
	set: function (opts) {
		var _opts = this.opts || null;
		this.opts = _extend(true, {} , DEFAULT_OPTIONS, opts);
		return _opts;
	},
	_strToFormData: function (str) {
		var File = UTIL.File;
		var ary = str.split('&'),l=ary.length,fd = new FormData();
		while (l--) {
			var tmp = ary[l].split('='),key = tmp.shift(), val= tmp.join('=');
			if (key.indexOf('wguF-')!=-1) {//file
				fd.append(key.substr(5), File(val));
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
		if (parseInt(UTIL.VERSION,10) >= 14) {
			return UTIL.proxy(xhr);
		} else {
			return xhr;
		}
	},
	
	post: function (ajax) {
		ajax = ajax || this;
		
		let xhr = ajax.xhr;
		let opts = this.opts;
		
		!!opts.listener.create && opts.listener.create.call(ajax);
		opts.headers['wguG-Cookie'] = COOKIE_MANAGE.getCookie(opts.appKey, opts.userInfo.userId, opts.url);
		
		xhr.open(opts.method.split('_')[0], (!opts.cache ? addRandom(opts.url): opts.url), true);
		opts.body = ajax._getBody(opts.body);//进行简单的参数处理
		for (var i in opts.headers) {
			xhr.setRequestHeader(i, opts.headers[i]||' ');
		}
		opts.state = 'post';
		
		if (opts.method == "POST") {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(opts.body);
		} else if (opts.method == "POST_FILE") {//file支持需要缓存功能'
			xhr.send(ajax._strToFormData(opts.body));
		} else {
			xhr.send(opts.body);
		}
		
		if (!!opts.timeout) {
			ajax.timer.setTimeout(ajax.reload, opts.timeout, ajax);		
		}
		return this;
	},
	reload: function (ajax) {
		ajax = ajax || this;
		let opts = this.opts;
		let xhr = ajax.xhr;
		opts.state = 'reload';
		if (!!opts.listener.reload) {
			if (opts.listener.reload.call(ajax) == true) {
				return;
			}
		}
		if (xhr.readyState < 3) {
			xhr.abort();
			ajax.post();
		}
	}
}