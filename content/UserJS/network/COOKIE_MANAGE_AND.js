const EXPORTED_SYMBOLS = ['COOKIE_MANAGE'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/network/COOKIES.js');



function getURIHost (aURL) {
	try {
		return Services.io.newURI(aURL, null, null).host;
	} catch (e) {
		return '';
	}
}

function getType(value) {
	return Object.prototype.toString.call(value);
};

const COOKIE_MAP = {
	'expires': 1,
	'path': 1,
	'domain': 1,
	'version': 1,
	'max-age': 1
};

const COOKIE_HOST = 'www.wgu.com';
const COOKIE_SERVICE = Services.cookies;
const COOKIE_MANAGE = {
	cache: {},
	init: true,
	setUserIdCK: function (_appKey, _userId) {
		COOKIES.add(COOKIE_HOST + '/' + _appKey + '/', 'userId='+encodeURIComponent(_userId));
		return this;
	},
	getUserIdCK: function (_appKey) {
		return decodeURIComponent(COOKIES.getOne(COOKIE_HOST + '/' + _appKey + '/','userId'));
	},
	toFF: function (_appKey, _userId) {
		let cache = this.cache;
		if (!_userId) {
			_userId = this.getUserIdCK(_appKey);
		}
		if (!!cache[_appKey] && !!cache[_appKey][_userId]) {
			for (var hostPsth in cache[_appKey][_userId]) {
				COOKIES.add(hostPsth, cache[_appKey][_userId][hostPsth]);
			}
		}
		this.setUserIdCK(_appKey, _userId);
		return this;
	},
	fromFF: function (_appKey, _userId, hostAry) {
		this.setUserIdCK(_appKey, _userId);
		this.cache[_appKey] = this.cache[_appKey] || {};
		this.cache[_appKey][_userId] = {};
		for (let i = 0, len = hostAry.length; i < len; i++) {
			_extend(this.cache[_appKey][_userId], COOKIES.getHost(hostAry[i]));
		}
		return this;
	},
	clearFF: function (hostAry) {
		for (let i = 0, len = hostAry.length; i < len; i++) {
			COOKIES.removeHost(hostAry[i]);
		}
		return this;
	},
	//setCookie to cache
	setCookie: function (ck, _appKey, _userId, uri) {
		if (getType(ck) == "[object String]") {
			let cks = ck.split('\n'), re = [];
			for (let i = 0, len = cks.length; i < len; i++) {
				let obj = {};
				cks[i].replace(/;? ?([^ ]+?)=([^;]+)/g,function (re, name, val){
					if (name.toLowerCase() in COOKIE_MAP) {
						obj[name.toLowerCase()] = val;
					} else {
						obj.key = name||'';
						obj.value = val||'';
					}
				});
				re.push(obj);
			}
			this.setCookie(re,_appKey,_userId,uri);
		} else if (getType(ck) == "[object Array]") {
			for (let i = 0, len = ck.length; i < len; i++){
				this.setCookie(ck[i],_appKey,_userId,uri);
			}
		} else if (getType(ck) == "[object Object]") {
			var domain = getURIHost(uri);
			this.cache[_appKey] = this.cache[_appKey] ||{};
			this.cache[_appKey][_userId] = this.cache[_appKey][_userId] || {};
			let cks = this.cache[_appKey][_userId];
			//console.log((ck.domain||'none')+ck.key);
			if (!!ck.domain) {
				if (ck.domain[0] != '.'){
					ck.domain = '.' + ck.domain;
				}
			} else {
				ck.domain = domain;
			}
			ck.path = ck.path || '/';
			
			cks[ck.domain + ck.path] = cks[ck.domain + ck.path] || '';
			if (ck.value=='deleted'){
				cks[ck.domain + ck.path] = cks[ck.domain + ck.path].replace(new RegExp('(^|; )' + ck.key + '=[^;]+(; )?'), '; ');
			} else {
				cks[ck.domain + ck.path] = cks[ck.domain + ck.path].replace(new RegExp('(^|; )' + ck.key + '=[^;]+(; )?'), '$2') +
											'; ' + ck.key + '=' + ck.value;
			}

		}
		return this;
	},
	getCookie: function (_appKey, _userId, url){
		if (!this.cache[_appKey]) {
			return '; ';
		}
		let cks = this.cache[_appKey][_userId]||{}, res = [];
		if (!!url) {
			url = '.' + url.replace(/^[^\.]+:\/+/, '')+'/';
		}
		for (var i in cks) {
			let j = i;
			if (i[0] != '.') {
				i = '.' + i;
			}
			if (!url || url.indexOf(i) != -1) {
				res.push(cks[j]);
			}
		}
		return res.join('; ')+'; ';
	},
	remove: function (hostAry) {
		for (let i = 0, len = hostAry.length; i < len; i++) {
			COOKIES.removeHost(hostAry[i]);
		}
		return this;
	}
};