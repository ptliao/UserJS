const EXPORTED_SYMBOLS = ['INFO_MANAGE'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/datebase/DateBase.js');
/*
DB: appKey,userId,useInfos
appKey:{
	userId:{
		'name=value;'
	}
}

*/

function getType(value) {
	return Object.prototype.toString.call(value);
}

function getparamsAry (paramsAry, cache, appKey) {
	for (var userId in cache[appKey]) {
		paramsAry.push({
			'appKey': appKey, 
			'userId': userId, 
			'useInfos': JSON.stringify(cache[appKey][userId])
		})
	}
}

const COOKIE_SERVICE = Services.cookies;
const INFO_MANAGE = {
	db: new DateBase('USL://datebase/cache.sqlite').open(),
	cache: {},
	fromDB: function (_appKey) {
		var cache = this.cache, _sql = 'select * from info ' + (!!_appKey ? ' where appKey = ' + _appKey : '');
		var self = this;
		this.db.exeSQLAsync(_sql, {} ,function (mess, res) {
			if (mess == 'OK') {
				for (let i = 0, len = res.length; i < len; i++) {
					let line = res[i];
					cache[line.appKey] = cache[line.appKey] || {};
					cache[line.appKey][line.userId] = JSON.parse(line.useInfos);
				}
			} else if (mess == 'Completion' || mess == 'Error') {
				self.init = mess;
				Services.obs.notifyObservers(null, 'userjs-INFO_MANAGE', mess);
			}
		})
	},
	toDB: function (_appKey, userId) {
		let cache = this.cache, paramsAry = [];
		
		if (!!_appKey) {
			if (!!userId) {
				paramsAry.push({
					appKey: _appKey,
					userId: userId,
					useInfos: JSON.stringify(cache[_appKey][userId])
				});
			} else {
				getparamsAry(paramsAry, cache, _appKey);
			}
		} else {
			for (var appKey in cache) {
				getparamsAry(paramsAry, cache, appKey);
			}
		}
		if (paramsAry.length > 0) {
			this.db.exeSQLBatchAsync("REPLACE INTO info(appKey, userId, useInfos) VALUES (:appKey, :userId, :useInfos)",paramsAry);
		}
		return this;
	},
	toDBAll: function (filter) {
		let cache = this.cache, paramsAry = [];
		filter = filter || function () {return true};
		for (var appKey in cache) {
			if (filter(appKey)) {
				getparamsAry(paramsAry, cache, appKey);
			}
		}
		if (paramsAry.length > 0) {
			this.db.exeSQLBatchAsync("REPLACE INTO info(appKey, userId, useInfos) VALUES (:appKey, :userId, :useInfos)",paramsAry);
		}
		return this;
	},
	clearDB: function (_appKey) {
		if (!!_appKey) {
			delete this.cache[_appKey];
			this.db.SQL("DELETE FROM info where appKey = '"+_appKey+"'");
		}
	},
	set: function (jsonStr, _appKey, userId) {
		this.cache[_appKey] = this.cache[_appKey] || {};
		if (typeof userId != "undefined") {
			this.cache[_appKey][userId] = this.cache[_appKey][userId] || {};
			_extend(this.cache[_appKey][userId],JSON.parse(jsonStr));
		}
	},
	get: function (_appKey, userId) {
		return this.cache[_appKey][userId];
	}
}

if (!INFO_MANAGE.init) {
	INFO_MANAGE.init = true;
	INFO_MANAGE.fromDB();
}