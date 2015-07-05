const EXPORTED_SYMBOLS = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];

const { classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
        results: Cr, manager: Cm } = Components;

const TIME_MAP = {};
const TIME_MAX_ID = 0;

function setTimeout(func, delay) {
	var timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
	let argAry =  Array.prototype.slice.call(arguments, 2);
	timer.initWithCallback({
		notify: function () {
			func.apply(null, argAry);
			func = null;
			argAry = null;
		}
	}, delay, Ci.nsITimer.TYPE_ONE_SHOT);
	TIME_MAX_ID ++;
	TIME_MAP[TIME_MAX_ID] = timer;
	return TIME_MAX_ID;
}

function setInterval (func, delay) {
	var timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
	let argAry =  Array.prototype.slice.call(arguments, 2);
	timer.initWithCallback({
		notify: function () {
			func.apply(null, argAry);
		}
	}, delay, Ci.nsITimer.TYPE_REPEATING_PRECISE);
	TIME_MAX_ID ++;
	TIME_MAP[TIME_MAX_ID] = timer;
	return TIME_MAX_ID;
}

function clearTimeout (timerId) {
	let timer = TIME_MAP[timerId];
	if (!!timer) {
		timer.cancel();
	}
	delete TIME_MAP[timerId]
}

function clearInterval (timerId) {
	let timer = TIME_MAP[timerId];
	if (!!timer) {
		timer.cancel();
	}
	delete TIME_MAP[timerId]
}