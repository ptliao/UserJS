const EXPORTED_SYMBOLS = [ 'CONFIG' ];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/Prefs.js');

var pref = new Prefs();
var CONFIG = {
	get javascript ()  {
		return pref.get("javascript.enabled")==true?'on':'off';
	},
	set javascript (str) {
		if (str == 'off') {
			pref.set("javascript.enabled", false);
			return 'off';
		} else {
			pref.set("javascript.enabled", true);
			return 'on';
		}
	},
	get animationImage ()  {
		return pref.get("image.animation_mode")=='normal'?'on':'off';
	},
	set animationImage (str) {
		if (str == 'off') {
			pref.set("image.animation_mode", 'none');
			return 'off';
		} else {
			pref.set("image.animation_mode", 'normal');
			return 'on';
		}
	},
	get image ()  {
		return pref.get("permissions.default.image")==1?'on':'off';
	},
	set image (str) {
		if (str == 'off') {
			pref.set("permissions.default.image", 2);
			return 'off';
		} else {
			pref.set("permissions.default.image", 1);
			return 'on';
		}
	}
}