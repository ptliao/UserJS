const EXPORTED_SYMBOLS = ['Worker'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/Timer.js');
Components.utils.import('chrome://UserJS/content/network/Ajax.js');
		
function Worker (opt) {
	if (!(this instanceof Worker)) {
		return new Worker(opt);
	} else {
		_extend(this, {
			maxDis: 1000,
			outDis: 200,
			maxNum: 10
		}, opt);
		this.sendtime = this.sendtime.valueOf();
		this.done = false;
		this.timer = Timer();
		this.thread = this.thread || 3;
		this.out = '';
		var self = this;
		this.timeout = function () {
			if (self.done == false) {
				self.done = true;
				//self.sendAjax.post();
				self.fun();
			}
		};
	}
};
Worker.prototype = {
	check: function () {
		var self = this;
		var opt = {
			url: this.checkURL,
			outerWindowID: this.outerWindowID,
			cache: false,
			listener: {
				create: function () {
					this.sendTimeC = new Date().valueOf();
				},
				load: function () {
					var xhr = this.xhr;
					if (xhr.readyState == 4) {
						this.num ++;
						let readyTimeC = new Date().valueOf();
						let readyTimeS = new Date(xhr.getResponseHeader('Date')).valueOf();
						let out = self.sendtime - readyTimeS + this.sendTimeC - readyTimeC;
						//console.log('readyTimeC':+readyTimeC);
						//console.log('readyTimeS':+readyTimeS);
						//console.log('sendtime':+self.sendtime);
						//console.log('sendTimeC':+self.sendTimeC);
						if (readyTimeC - this.sendTimeC <= self.maxDis) {
							if (out > -2000) {
								if (self.out === '' || self.out - out > self.outDis) {
									self.out = out;
									console.log('Worker setTimeout !!');
									self.timer.setTimeout(self.timeout, self.out < 0 ? 0 : self.out);
									return;
								}
							}
						}
						if (self.done == false && self.sendtime - readyTimeS > 5000 ) {
							if (this.num <= self.maxNum) {
								this.timer.setTimeout(this.post, self.checkTime, this);
							}
						}
					}
				},
				error: function () {
					this.timer.setTimeout(this.post, self.checkTime, this);
				}
			},
			out: '',
			num: 0
		};

		let i = this.thread;
		while (i--) {
			opt.thread = i;
			Ajax(opt).post();
		}
	}
};

/*
var Worker = gw.require('Worker');
Worker({
    checkURL: 'http://read.139life.com/magazine/hd_20120515/index.php',
    sendtime: new Date(2012,5,3,1),
    fun:function () {
		var inputs = document.querySelectorAll('input');
		inputs[inputs.length-1].click()
    }
}).check()
*/