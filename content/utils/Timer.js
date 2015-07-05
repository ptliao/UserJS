const EXPORTED_SYMBOLS = ['Timer'];

const { classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
        results: Cr, manager: Cm } = Components;

function Timer() {
	if (!(this instanceof Timer)) {
		/*var obj = Object.create(Prefs.prototype);
		obj.pref = Services.prefs.getBranch(startPoint);
		return obj;*/
		return new Timer();
	} else {
		this.timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
	}
}
Timer.prototype = {
	setTimeout: function (func, delay) {
		let argAry =  Array.prototype.slice.call(arguments, 2);
		this.timer.initWithCallback({
			notify: function () {
				func.apply(null, argAry);
				func = null;
				argAry = null;
			}
		}, delay, Ci.nsITimer.TYPE_ONE_SHOT);
	},
	setInterval: function (func, delay) {
		let argAry =  Array.prototype.slice.call(arguments, 2);
		this.timer.initWithCallback({
			notify: function () {
				func.apply(null, argAry);
			}
		}, delay, Ci.nsITimer.TYPE_REPEATING_PRECISE);
	},
	cancel: function () {
		try {
			this.timer.cancel();
		} catch (e) {}
	}
}