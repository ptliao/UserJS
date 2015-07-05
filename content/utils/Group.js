const EXPORTED_SYMBOLS = [ 'Group' ];
Components.utils.import('chrome://UserJS/content/require.js');

var COOKIE_MANAGE = require('COOKIE_MANAGE');
var OPTS_MANAGE = require('OPTS_MANAGE');
var Ajax = require('Ajax');
var _load = function () {
	var xhr = this.xhr, post = true;
	if (xhr.readyState==4) {
		var ck = xhr.getResponseHeader('wguG-Set-Cookie');
		if (!!ck) {
			COOKIE_MANAGE.setCookie(ck, this.appKey, this.userInfo.userId,this.url);
		}
		this.__item.next();
	}
}


function Item (userInfo,gp) {
	if (!(this instanceof Item)) {
		return new Item(userInfo,gp);
	} else {
		this.gp = gp;
		
		this.appKey = gp.appKey;
		this.workList = [];
		for (var i = 0, len = gp.workList.length;i<len;i++) {
			this.workList[i] = gp.workList[i];
		}
		
		this.index = 0;
		this.ajax = Ajax(_extend({
			outerWindowID: gp.outerWindowID||''
			,userInfo: userInfo
			,__item: this
			,console: console
		}, gp.ajaxOpt));
	}
}

Item.prototype = {
	post: function () {
		if (_toString(this.workList[this.index]) == "[object String]") {
			var opts = OPTS_MANAGE[this.appKey][this.workList[this.index]];
		} else {
			var opts = this.workList[this.index];
		}
		if (!!opts.filter) {
			if (!opts.filter(this.ajax.userInfo)) {
				return this.next();
			}
		}
		if (!opts.listener.load) {
			opts.listener.load = _load;
		}
		this.ajax.set(opts).post();
	},
	begin: function () {
		//console.log('Item.begin');
		this.index = 0;
		this.post();
		return this;
	},
	next: function (key) {
		if (!!key) {
			this.workList.splice(this.index, 0, key);
		} else {
			this.index++;
		}
		if (this.isEnd()) {
			if (this.gp.isEnd()) {
				this.gp._onEnd();
			}
		} else {
			this.post();
		}
		return this;
	},
	isEnd: function () {
		return this.index >= this.workList.length;
	},
	end: function () {
		return this.next();
	}
}

function Group(opt) {
	if (!(this instanceof Group)) {
		return new Group(opt);
	} else {
		this.thread = 1;
		this.items = {};
		this.state = "init";
		_extend(this,opt);
	}
}

Group.prototype = {
	getId: function (item) {
		return item.userId;
	},
	isEnd: function () {
		for (var i in this.items) {
			if (!this.items[i].isEnd()) {
				return false;
			}
		}
		return true;
	},
	_onEnd: function () {
		if (this.state == "begin") {
			this.state = "end";
			this.onEnd();
		}
	},
	_onBegin: function () {
		this.state = "begin";
		this.onBegin();
	},
	onEnd: function () {},
	onBegin: function () {
		//this.workList = ['1','2'];
	},
	start: function () {
		this._onBegin();
		var map = this.map ,i;
		for (i in map) {
			//console.log('map:'+i);
			if (map.hasOwnProperty(i)) {
				var id = this.getId(map[i]);
				for (j=0;j<this.thread;j++) {
					this.items[id+';'+j] = new Item(map[i],this);				
				}
			}
		}
		for (var i in this.items) {
			this.items[i].begin();
		}
	},
	log: function () {
		for (var i in this.items) {
			if (!this.items[i].isEnd()) {
				//console.log('thread '+i+': working;')
			}
		}
	}
}