const EXPORTED_SYMBOLS = [ 'Post' ];
Components.utils.import('chrome://UserJS/content/require.js');

var INFO_MANAGE = require('INFO_MANAGE');
var COOKIE_MANAGE = require('COOKIE_MANAGE');
var Ajax = require('Ajax');
var UTIL = require('UTIL');
var Group = require('Group');

var __config =  {
	lockT: 10000,
	lookT: 1000,
	timeout: 1500,
	nextT: 6000,
	lookfl: 60,
	sendfl: 20,
	mode: "post",
	send: 'send',
	j:0
};

var __opt = {
	listener: {
		create: function(){
			var tidInfo = this.tidInfo;
			this.method = 'POST';
			this.url = UTIL.strFormat(UTIL.strFormat(tidInfo.sendURL,tidInfo),this.userInfo);
			this.body = UTIL.strFormat(UTIL.strFormat(UTIL.strFormat(tidInfo.body,this.userInfo),this),tidInfo);
			this.headers = {
				'wguS-Cookie': COOKIE_MANAGE.getCookie(this.appKey,this.userInfo.userId,this.url),
				'x-forward-for': this.userInfo.ip||''
			}
			if (this.wguSReferer) {
				this.headers['wguS-Referer'] = this.wguSReferer;
			}
		},
		load: function () {
			var tidInfo = this.tidInfo;
			var xhr = this.xhr;
			if (xhr.readyState == 4) {
				if (tidInfo['send'] != "end") {//结束
					if (tidInfo.ch) {
						this.mess = tidInfo.mess[tidInfo.j++ % tidInfo.mess.length];
					}
					this.num++;
					if (tidInfo.num == 0 || this.num < tidInfo.num) {
						if (tidInfo['send'] == 'send') {
							if (tidInfo.mode == "post") {
								this.timer.setTimeout(this.post, tidInfo.nextT, this);
							}
						}
					} else {
						tidInfo['send'] = "end";
					}
				}
			}
		}
	},
	num: 0
};


function Post (tidInfo, cache, ajaxOpt) {
	if (!(this instanceof Post)) {
		return new Post(tidInfo, cache, ajaxOpt);
	} else {
		this.tidInfo = _extend({}, __config, tidInfo);
		this.cacheOBJ = cache;
		this.ajaxOpt = ajaxOpt;
		this.post();
	}
}

Post.prototype = {
	post: function () {		
		if (this.tidInfo.num == 0) {//监控
			this._lock = this.__lock();
			this._lock();
		};
		this._post();
	},
	_post: function () {
		var tidInfo = this.tidInfo;
		var self = this.cacheOBJ;
		
		var _opt = {
			outerWindowID: self.outerWindowID,
			appKey: self.appKey,
			map: self._getInfos(),
			workList: [__opt],
			onEnd: function () {},//数据库存储
			thread: __opt.thread || 1
		};
		if (tidInfo.beforeWorkList) {
			_opt.workList.unshift(tidInfo.beforeWorkList());
		}
		
		_opt.ajaxOpt = _extend({
			tidInfo: tidInfo,
			timeout: tidInfo.timeout,
			tid: tidInfo.tid
		},this.ajaxOpt);
		
		this.group = new Group(_opt);
		if (tidInfo.mode == "post") {
			this.group.start();
		}
		return this;
	},
	_repost: function (flag) {
		flag = flag || false;
		if (this.tidInfo['send'] == 'send'){
			if (this.tidInfo.mode == "post" || flag == true) {
				this.group.start();
			}
		}
	},
	__lock: function () {
		var tidInfo = this.tidInfo,
			self = this,
			looking = "waite",
			thread = [];
			
		var opt = {
			method: 'GET',
			url: UTIL.strFormat(tidInfo.lockURLT,tidInfo),
			body: '',
			outerWindowID: this.cacheOBJ.outerWindowID,
			listener: {
				load: function () {
					var xhr = this.xhr;
					if (xhr.readyState == 4) {
						if (tidInfo['send'] != "end") {
							var fl = parseInt(tidInfo.getfl(xhr.responseText));
							//console.log('当前楼层:' + fl);
							var myXHR = this;
							var flag = false;
							if (tidInfo.isLock == true) {
								tidInfo['fl'].some(function (v) {
									v = parseInt(v);
									if (fl < v - tidInfo.lookfl) {//属于踩楼区域
										flag = true;
										tidInfo['send'] = 'send';
										if (looking == "look") {//等待状态，post停止
											looking = "waite";
											self._repost();
										}
									} else if (v-tidInfo.lookfl <= fl && fl < v-tidInfo.sendfl && v-tidInfo.lookfl > 0) {//属于监控区域
										flag = true;
										tidInfo['send'] = 'waite';
										if (looking == "waite") {
											looking = "look";
											if (myXHR.child == false) {//主流程启动线程
												if (thread.length == 0) {
													for (var i = 0; i < 5; i++) {
														thread.push(self._lock(true, tidInfo.lookT));
													}
												} else {
													for (var i = 0; i < 5; i++) {
														thread[i].post();
													}
												}
											}
										}
									} else if (v-tidInfo.sendfl <= fl && fl <= v && v-tidInfo.lookfl > 0) {
										flag = true;
										/*
										if(looking=="look"&&tidInfo['send']=='waite'){
											self._repost();
										}
										if(looking=="waite"&&tidInfo['send']=='send'){
											self._repost();
										}
										*/
										if (looking == "look") {
											looking = "waite";
											tidInfo['send'] = 'send';
											self._repost(true);
										}
										myXHR.lockT = tidInfo.lockT;
									}
									return flag;
								})
							} else {
								tidInfo['fl'].some(function (v) {
									v = parseInt(v);
									if (fl <= (v + 20)) {
										flag = true;
									}
									return flag;
								})
							}
							
							if (flag == false) {
								tidInfo['send'] = 'end';
								looking = "waite";
								arguments.callee = function () {
									return ;
								}
							} else {
								if (this.child == true) {
									looking =="look" && this.timer.setTimeout(this.post, this.lockT, this);
								}else{
									this.timer.setTimeout(this.post, this.lockT, this);
								}
							}
						}
					}
				}
			}
		};
		return function(child, t) {
			opt.child = child || false;
			opt.lockT = t || tidInfo.lockT;
			return Ajax(opt).post();
		}
	}
}
