// ==UserScript==
// @name           UserScriptLoader.uc.js
// @author         Griever
// @include        main
// @description    Greasemonkey っぽいもの
// @version        0.1.6.1
// @note           0.1.6.1 uAutoPagerize との連携ができなかったのを修正
// @note           0.1.6.1 .user.js 間での連携は多分できません。。
// @note           0.1.6 色々修正。unsafeWindow 使ってて動かなかった物が動くかも
// @note           0.1.6 Firefox 3.6 は切り捨てた
// ==/UserScript==
(function() {

	const EDITOR = 'D:\\Program Files\\Notepad++\\notepad++.exe'; 
	const SCRIPTS_FOLDER  = '';

	const ON_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACfUlEQVQ4jYWTT0iTcRzGn2Odlp77YywiFrXYJNTNvS9KJHSwspuBlTgNEY2IabreamUE5cxZy8jeMlKTcngoo4vdPKp1CDa3V6OoW8cdPx3e/igVPvDAlx+/5+ELz/OVNkA8LP+liDpP7lOmdqecjf5LknqrtMOKKGkZctoPisO7hFkmIttlbSi2IkpaprBM0bjfFZplon6POF+puTqvnGCJPP8WG1qwTJFsKKG1XDQdEM0Bcb7KZYNPVG+VsX7datX3GcrEDWUmuvZSXExAdoCFJ41Yplh40gjZAYqLCSa69hI3lOkzlOmtVr1rULP5+2hHAMuUK84NQv4eFB7gzF6AwgPIpyE3RHHxGpYpRjsC9NZs/i5JSrUFmOk/gh31Qi4J+TT25GnssRZYfYb9PIo9dgYKI5C7gx31MtN/hFRbANegI8R4LMRsIgLLw+A8xOw02RLeAp+n/8yODfl7zCYivLBqSXWEXIOWSKkzHgsxnz7qrr7yGO0W2ib4+ubPvDoGhRHm08d4YdXSEil1O1HnVdPFmk0Ul67/NrDvnsW+2wXf3mKnz2EPt8PqUyiMUFzq52LNJuq8apIkxYLyJBtKIHubwd7jvH91BT6Nw+eX8GUGvkzDp0k+vL7KUN8JyA5gmeJ3jLGgPL8SWJm7RPMhP02+7Vyr8HG/0sfNCh8tvh20HvKz8u4yxcXEeoOfBZrL9JRD9hbkhiB/H5yH4DwCZ9RNYHkYsrfJ9JRjGZpbZxAPy28Zcuyol49Tp9w4l1OuaDkFuUE+Tp3GjnqxDDnxsPx/1TgWlKctqBvdIeV+3cJadoeUawvqRiz4nztYgzJJFZLMNaz4+f4XfgD0Pa0cZIQJwAAAAABJRU5ErkJggg==";
	const OFF_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACn0lEQVQ4jYWTzUsbURTF704QoS5KgkVSDcPY6jBJrJAQ01e/sCZNX0eRKi5iFsUWiQakRCkyhyJZSAhBpEgRcSEupAQpRUIIIQxBuhiGEIYhhCBSSv+PLqJBUfDC4V0e9/w2516iB4p7Jfu7gOz1ST1zz3vs8YfmiYho4oXz0ZuXrtecyfGRIRH9zicQHTYI3Y9fPWi+MoIzGT6pB6LDBtFhg1vsxqRvYFFydsUForZ7zW+Z6yNnMiIKAxsU4ZedCLgFTPr6Menrx+AzB3q7Op/eMk0Ny31h5poLM9dcYnkeupaFqedwtJcEZzKO9pKw9Bx0LYvE8jyuZ6eG5T4iIpoe86yrMQ7OZOhaFpaRR61SRL1aQi57gHq1hFqlCMvIQ9dOwZkMNcYxPeZZJyKijaUQ9pMRrEYVWHrTvPNtCzu7W7iwzrG7l0Rm5ytq1RIsI4/VqIL9ZAQbSyEQEZEaCyOVmMX25jJqRgH1qoZYIgbRLeJPXW/1DVNDrVLE9uYydtUFqLFwExAKSPFUYhbf019QqxTRMMvosHWgvbMdfy+rrb5hnaNWKWE/s4lddQGhgNTciYFem0sZcUMvn7YA6ZSKTHoL/y5NZDJJpFNqC2CUT6GMuDHQa3MREVFQENoiCoOp51A4OwafHMOEbwhRHkLs/Qw+KGGE/D7MhCZQPDuGqefAmYxWjEFBaLtOILG2hJ8n+2iYZVxYv3FRa6phlvHrxwE2Pn+CrmVvA4iIOJMX1bUoTD0HyyhcxaihbmrNt1qCZRRg6jmoa1FwJi/eBnglO2dyfDWq4OQwDUvPN0FGAZZRgGXkcXKYxmpUAWdynHsl+501DgpC26hHHA/6pZXrW7ipoF9aGfWI40FBuP8OblQnEXUTUc8NdV/936n/dk9TC4NyEZEAAAAASUVORK5CYII=";

	const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
	if (!window.Services)
		Cu.import("resource://gre/modules/Services.jsm");
	
	var observer = (function(){
		var list = Services.wm.getEnumerator('navigator:browser');
		while(list.hasMoreElements()) {
			let win = list.getNext();
			if (win.UserScriptLoader && win.UserScriptLoader.observer) {
				return win.UserScriptLoader.observer;
			}
		}
		return {
			disabled: true,
			observe: function(subject, topic, data){
				var doc = subject.document;
				var evt = doc.createEvent("Events");
				evt.initEvent("USL_DocumentStart", true, false);
				doc.dispatchEvent(evt);
			},
			register: function(){
				Services.obs.addObserver(this, "content-document-global-created", false);
				this.disabled = false;
				log('USL observer start');
			},
			unregister: function(){
				Services.obs.removeObserver(this, "content-document-global-created");
				this.disabled = true;
				log('USL observer end');
			}
		};
	})();

	if (typeof window.UserScriptLoader != 'undefined') {
		window.UserScriptLoader.theEnd();
	}

	var ns = window.UserScriptLoader = {

		ON_IMAGE         : ON_IMAGE,
		OFF_IMAGE        : OFF_IMAGE,
		AUTO_REBUILD     : false,

		readScripts      : [],

		_disabled        : null,
		observer         : observer,

		get pref() {
			delete this.pref;
			return this.pref = GM_Pref('UserScriptLoader.');
		},
		get SCRIPTS_FOLDER() {
			var folderPath = this.pref.getValue('SCRIPTS_FOLDER', SCRIPTS_FOLDER);
			var aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
			if (!folderPath) {
				var UChrm = Services.dirsvc.get("UChrm", Ci.nsIFile);
				aFolder.initWithPath(UChrm.path);
				aFolder.appendRelativePath('UserScriptLoader');
			}else {
				aFolder.initWithPath(folderPath);
			}
			try {
				if( !aFolder.exists() || !aFolder.isDirectory() ) {
					aFolder.create(Ci.nsIFile.DIRECTORY_TYPE, 0664);
				}
			} catch (e) {
				log(e);
				return ;
			}
			
			//log(aFolder.path)
			delete this.SCRIPTS_FOLDER;
			return this.SCRIPTS_FOLDER = aFolder;
		},
		get EDITOR() {
			delete this.EDITOR;
			return this.EDITOR = this.pref.getValue('EDITOR', EDITOR);
		},
		get HIDE_EXCLUDE() {
			delete this.HIDE_EXCLUDE;
			return this.HIDE_EXCLUDE = this.pref.getValue('HIDE_EXCLUDE', false);
		},
		get disabled_scripts() {
			var ds = this.pref.getValue('script.disabled', '');
			delete this.disabled_scripts;
			return this.disabled_scripts = ds? ds.split('|') : [];
		},
		get disabled () this._disabled,
		set disabled (bool) {
			this._disabled = bool;
			if (bool) {
				gBrowser.mPanelContainer.removeEventListener('USL_DocumentStart', this.onDocumentStart, false);
				this.icon.setAttribute('src', this.OFF_IMAGE);
			} else {
				gBrowser.mPanelContainer.addEventListener('USL_DocumentStart', this.onDocumentStart, false);
				this.icon.setAttribute('src', this.ON_IMAGE);
			}
			return bool;
		},
		getFocusedWindow: function(){
			var win = document.commandDispatcher.focusedWindow;
			if (!win || win == window)
				win = content;
			return win;
		},
		init: function() {
			ns._disabled = ns.pref.getValue('disabled', ns._disabled);

			if (ns.observer.disabled)
				ns.observer.register();

			ns.icon = $('urlbar-icons').appendChild($E(
				<image id="UserScriptLoader-icon" 
					   context="UserScriptLoader-popup" 
					   onclick="UserScriptLoader.iconClick(event);"
					   style="padding: 0px 2px;"/>
			));

			ns.popup = $('mainPopupSet').appendChild($E(
				<menupopup id="UserScriptLoader-popup" 
						   onpopupshowing="UserScriptLoader.onPopupShowing(event);"
						   onpopuphidden="UserScriptLoader.onPopupHidden(event);"
						   onclick="UserScriptLoader.menuClick(event);">
					<menuseparator id="UserScriptLoader-menuseparator"/>
					<menu label="Menu" id="UserScriptLoader-submenu">
						<menupopup id="UserScriptLoader-submenu-popup">
							<menuitem label="Hide exclude script"
									  id="UserScriptLoader-hide-exclude"
									  accesskey="N"
									  type="checkbox"
									  checked={ns.HIDE_EXCLUDE}
									  oncommand="UserScriptLoader.HIDE_EXCLUDE = !UserScriptLoader.HIDE_EXCLUDE;"/>
							<menuitem label="Rebuild"
									  id="UserScriptLoader-auto-rebuild"
									  accesskey="R"
									  oncommand="UserScriptLoader.rebuild();"/>
						</menupopup>
					</menu>
				</menupopup>
			));

			ns.menuseparator   = $('UserScriptLoader-menuseparator');
			ns.hideExcludeMenu = $('UserScriptLoader-hide-exclude');
			ns.autoRebuildMenu = $('UserScriptLoader-auto-rebuild');

			ns.importScripts();
			ns.disabled = ns._disabled;
			window.addEventListener('unload', ns.uninit, false);
		},
		uninit: function(event) {
			var disabledScripts =[],scripts=ns.readScripts;
			for(var i=0,l=ns.readScripts.length;i<l;i++){
				if(scripts[i]._disabled)
					disabledScripts.push(scripts[i]._leafName);
			}
			var pref = ns.pref || GM_Pref('UserScriptLoader.');
			pref.setValue('script.disabled', disabledScripts.join('|'));
			pref.setValue('disabled', ns._disabled);
			pref.setValue('HIDE_EXCLUDE', ns.HIDE_EXCLUDE);
			if (!ns.disabled) ns.disabled = true;
			if (event) {
				var list = Services.wm.getEnumerator('navigator:browser');
				while(list.hasMoreElements()) {
					if (list.getNext() != window)
						return
				}
				ns.observer.unregister();
			}
		},
		theEnd: function() {
			ns.uninit();
			ns.icon.parentNode.removeChild(ns.icon);
			ns.popup.parentNode.removeChild(ns.popup);
		},
		importScripts: function() {
			ns.readScripts = [];

			var ext = /\.user\.js$/i;
			var files = ns.SCRIPTS_FOLDER.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
			while (files.hasMoreElements()) {
				let file = files.getNext().QueryInterface(Ci.nsIFile);
				if (ext.test(file.leafName))
					ns.loadScript(file);
			}
		},
		rebuild: function() {
			ns.disabled_scripts =[];
			var scripts=ns.readScripts;
			for(var i=0,l=ns.readScripts.length;i<l;i++){
				if(scripts[i]._disabled)
					ns.disabled_scripts.push(scripts[i]._leafName);
			}
			ns.importScripts();
		},
		loadScript: function(aFile) {
			var script = new ScriptEntry(aFile);
			script._disabled = ns.disabled_scripts.indexOf(script._leafName) >= 0;
			ns.readScripts.push(script);
			return;
		},
		onPopupShowing: function(event) {
			switch(event.target.id) {
				case 'UserScriptLoader-popup':
					ns.readScripts.forEach(function(script) {
						var win = this.getFocusedWindow();
						var run = win.USL_run;
						if (this.HIDE_DISABLED_SCRIPT && script._disabled) return;
						if (this.HIDE_EXCLUDE && !script._isURLMatching(win.location.href)) return;

						var m = document.createElement('menuitem');
						m.setAttribute('label', script.name || script._leafName);
						m.setAttribute('checked', !script._disabled);
						m.setAttribute('type', 'checkbox');
						m.setAttribute('oncommand', 'this.script._disabled = !this.script._disabled;');
						m.script = script;
						
						if (run && run.indexOf(script.name) >= 0)
							m.style.fontWeight = 'bold';
						this.popup.insertBefore(m, this.menuseparator);
					}, ns);
					break;

				case 'UserScriptLoader-submenu-popup':
					ns.hideExcludeMenu.setAttribute('checked', ns.HIDE_EXCLUDE);
					ns.autoRebuildMenu.setAttribute('checked', ns.AUTO_REBUILD);
					break;
			}
		},
		onPopupHidden: function(event) {
			var popup = event.target;
			switch(popup.id) {
				case 'UserScriptLoader-popup':
				case 'UserScriptLoader-register-popup':
					var child = popup.firstChild;
					while (child && child.localName == 'menuitem') {
						popup.removeChild(child);
						child = popup.firstChild;
					}
					break;
			}
		},
		menuClick: function(event){
			var menuitem = event.target;
			if (event.button == 0 || menuitem.getAttribute('type') != 'checkbox')
				return;

			event.preventDefault();
			event.stopPropagation();
			if (event.button == 1) {
				menuitem.doCommand();
				menuitem.setAttribute('checked', menuitem.getAttribute('checked') == 'true'? 'false' : 'true');
			} else if (event.button == 2 && ns.EDITOR && menuitem.script) {
				var app = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
				app.initWithPath(ns.EDITOR);
				var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
				process.init(app);
				process.run(false, [menuitem.script._path], 1);
			}
		},
		iconClick: function(event){
			if (event.button == 0) {
				ns.disabled = !ns.disabled;
				ns.pref.setValue('disabled', ns.disabled);
			} else if (event.button == 1) {
				ns.rebuild();
			}
		},
		onDocumentStart: function(event) {	
			var doc = event.target;
			var win = doc.defaultView;
			win.USL_run = [];
			ns.injectScripts(ns.readScripts, doc);
		},
		injectScripts: function(scripts, aDocument) {
			if (scripts.length === 0) return;
			
			var contentWindow = aDocument.defaultView;
			var unsafeWindow=contentWindow.wrappedJSObject;
			unsafeWindow.gw=gw;		
			
			//log('injectScripts:'+contentWindow.location.href);
			
			for(var i=0,l=scripts.length;i<l;i++){
				let script=scripts[i];
				if (script["run-at"] === "window-load"){
					contentWindow.addEventListener("load", function(event) {
						event.currentTarget.removeEventListener(event.type, arguments.callee, false);
						runScript(script, event.target);
					}, false);
				} else {
					contentWindow.addEventListener("DOMContentLoaded", function(event) {
						event.currentTarget.removeEventListener(event.type, arguments.callee, true);
						if (script['run-at'] === 'document-idle') {
							setTimeout(runScript, 0, script, event.target.defaultView);
						} else {
							runScript(script, event.target.defaultView);
						}
					}, true);
				}
			}
		}
	}

	function ScriptEntry(aFile) {
		this._readFile(aFile);
		this._init();

		this._includeRegExp = !this.include || this.include == '*'?
			/.*/:this._createRegExp(this.include);
		this._excludeRegExp = !this.exclude || this.exclude == '*'?
			null :this._createRegExp(this.exclude);
	}
	ScriptEntry.prototype = {
		_init: function() {
			this._disabled = false;
			if (!this['run-at'])
				this['run-at'] = 'document-end';
		},
		_readFile: function(aFile) {
			this._leafName = aFile.leafName;
			this._path = aFile.path;
		
			var stream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
			stream.init(aFile,1,0,false);
			var ss = Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
			ss.init(stream);
			var data = ss.read(ss.available());
			ss.close();
			stream.close();
			try {
				data = decodeURIComponent(escape(data));
			} catch(e) {  }

			var m = data.match(/\/\/\s*==UserScript==[\s\S]+?\/\/\s*==\/UserScript==/);
			if (!m)
				return;
			m = (m+'').split(/[\r\n]+/);
			for (var i = 0,l=m.length; i < l; i++) {
				if (!/\/\/\s*?@(\S+)($|\s+([^\r\n]+))/.test(m[i]))
					continue;
				var name  = RegExp.$1;
				var value = RegExp.$3;
				if (this[name]) {
					this[name] += '\n' + value;
				} else {
					this[name] = value;
				}
			}
		},
		_createRegExp: function(urlstr) {
			var regstr = urlstr.split('\n').map(function(str) {
				var res = '^' + str.replace(/([()[\]{}|+.,^$?\\])/g, "\\$1").replace(/\*/g, '.*');
				var tldRegExp = new RegExp("^(\\^(?:[^/]*)(?://)?(?:[^/]*))(\\\\\\.tld)((?:/.*)?)$");
				var tldRes = res.match(tldRegExp);
				if (tldRes) {
					var tldStr = "\.(?:demon\\.co\\.uk|esc\\.edu\\.ar|(?:c[oi]\\.)?[^\\.]\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.(?:(?:pvt\\.)?k12|cc|tec|lib|state|gen)\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nvus|ne|gg|tr|mm|ki|biz|sj|my|hn|gl|ro|tn|co|br|coop|cy|bo|ck|tc|bv|ke|aero|cs|dm|km|bf|af|mv|ls|tm|jm|pg|ky|ga|pn|sv|mq|hu|za|se|uy|iq|ai|com|ve|na|ba|ph|xxx|no|lv|tf|kz|ma|in|id|si|re|om|by|fi|gs|ir|li|tz|td|cg|pa|am|tv|jo|bi|ee|cd|pk|mn|gd|nz|as|lc|ae|cn|ag|mx|sy|cx|cr|vi|sg|bm|kh|nr|bz|vu|kw|gf|al|uz|eh|int|ht|mw|gm|bg|gu|info|aw|gy|ac|ca|museum|sk|ax|es|kp|bb|sa|et|ie|tl|org|tj|cf|im|mk|de|pro|md|fm|cl|jp|bn|vn|gp|sm|ar|dj|bd|mc|ug|nu|ci|dk|nc|rw|aq|name|st|hm|mo|gq|ps|ge|ao|gr|va|is|mt|gi|la|bh|ms|bt|gb|it|wf|sb|ly|ng|gt|lu|il|pt|mh|eg|kg|pf|um|fr|sr|vg|fj|py|pm|sn|sd|au|sl|gh|us|mr|dz|ye|kn|cm|arpa|bw|lk|mg|tk|su|sc|ru|travel|az|ec|mz|lb|ml|bj|edu|pr|fk|lr|nf|np|do|mp|bs|to|cu|ch|yu|eu|mu|ni|pw|pl|gov|pe|an|ua|uk|gw|tp|kr|je|tt|net|fo|jobs|yt|cc|sh|io|zm|hk|th|so|er|cz|lt|mil|hr|gn|be|qa|cv|vc|tw|ws|ad|sz|at|tg|zw|nl|info\\.tn|org\\.sd|med\\.sd|com\\.hk|org\\.ai|edu\\.sg|at\\.tt|mail\\.pl|net\\.ni|pol\\.dz|hiroshima\\.jp|org\\.bh|edu\\.vu|net\\.im|ernet\\.in|nic\\.tt|com\\.tn|go\\.cr|jersey\\.je|bc\\.ca|com\\.la|go\\.jp|com\\.uy|tourism\\.tn|com\\.ec|conf\\.au|dk\\.org|shizuoka\\.jp|ac\\.vn|matsuyama\\.jp|agro\\.pl|yamaguchi\\.jp|edu\\.vn|yamanashi\\.jp|mil\\.in|sos\\.pl|bj\\.cn|net\\.au|ac\\.ae|psi\\.br|sch\\.ng|org\\.mt|edu\\.ai|edu\\.ck|ac\\.yu|org\\.ws|org\\.ng|rel\\.pl|uk\\.tt|com\\.py|aomori\\.jp|co\\.ug|video\\.hu|net\\.gg|org\\.pk|id\\.au|gov\\.zw|mil\\.tr|net\\.tn|org\\.ly|re\\.kr|mil\\.ye|mil\\.do|com\\.bb|net\\.vi|edu\\.na|co\\.za|asso\\.re|nom\\.pe|edu\\.tw|name\\.et|jl\\.cn|gov\\.ye|ehime\\.jp|miyazaki\\.jp|kanagawa\\.jp|gov\\.au|nm\\.cn|he\\.cn|edu\\.sd|mod\\.om|web\\.ve|edu\\.hk|medecin\\.fr|org\\.cu|info\\.au|edu\\.ve|nx\\.cn|alderney\\.gg|net\\.cu|org\\.za|mb\\.ca|com\\.ye|edu\\.pa|fed\\.us|ac\\.pa|alt\\.na|mil\\.lv|fukuoka\\.jp|gen\\.in|gr\\.jp|gov\\.br|gov\\.ac|id\\.fj|fukui\\.jp|hu\\.com|org\\.gu|net\\.ae|mil\\.ph|ltd\\.je|alt\\.za|gov\\.np|edu\\.jo|net\\.gu|g12\\.br|org\\.tn|store\\.co|fin\\.tn|ac\\.nz|gouv\\.fr|gov\\.il|org\\.ua|org\\.do|org\\.fj|sci\\.eg|gov\\.tt|cci\\.fr|tokyo\\.jp|net\\.lv|gov\\.lc|ind\\.br|ca\\.tt|gos\\.pk|hi\\.cn|net\\.do|co\\.tv|web\\.co|com\\.pa|com\\.ng|ac\\.ma|gov\\.bh|org\\.zw|csiro\\.au|lakas\\.hu|gob\\.ni|gov\\.fk|org\\.sy|gov\\.lb|gov\\.je|ed\\.cr|nb\\.ca|net\\.uy|com\\.ua|media\\.hu|com\\.lb|nom\\.pl|org\\.br|hk\\.cn|co\\.hu|org\\.my|gov\\.dz|sld\\.pa|gob\\.pk|net\\.uk|guernsey\\.gg|nara\\.jp|telememo\\.au|k12\\.tr|org\\.nz|pub\\.sa|edu\\.ac|com\\.dz|edu\\.lv|edu\\.pk|com\\.ph|net\\.na|net\\.et|id\\.lv|au\\.com|ac\\.ng|com\\.my|net\\.cy|unam\\.na|nom\\.za|net\\.np|info\\.pl|priv\\.hu|rec\\.ve|ac\\.uk|edu\\.mm|go\\.ug|ac\\.ug|co\\.dk|net\\.tt|oita\\.jp|fi\\.cr|org\\.ac|aichi\\.jp|org\\.tt|edu\\.bh|us\\.com|ac\\.kr|js\\.cn|edu\\.ni|com\\.mt|fam\\.pk|experts-comptables\\.fr|or\\.kr|org\\.au|web\\.pk|mil\\.jo|biz\\.pl|org\\.np|city\\.hu|org\\.uy|auto\\.pl|aid\\.pl|bib\\.ve|mo\\.cn|br\\.com|dns\\.be|sh\\.cn|org\\.mo|com\\.sg|me\\.uk|gov\\.kw|eun\\.eg|kagoshima\\.jp|ln\\.cn|seoul\\.kr|school\\.fj|com\\.mk|e164\\.arpa|rnu\\.tn|pro\\.ae|org\\.om|gov\\.my|net\\.ye|gov\\.do|co\\.im|org\\.lb|plc\\.co\\.im|net\\.jp|go\\.id|net\\.tw|gov\\.ai|tlf\\.nr|ac\\.im|com\\.do|net\\.py|tozsde\\.hu|com\\.na|tottori\\.jp|net\\.ge|gov\\.cn|org\\.bb|net\\.bs|ac\\.za|rns\\.tn|biz\\.pk|gov\\.ge|org\\.uk|org\\.fk|nhs\\.uk|net\\.bh|tm\\.za|co\\.nz|gov\\.jp|jogasz\\.hu|shop\\.pl|media\\.pl|chiba\\.jp|city\\.za|org\\.ck|net\\.id|com\\.ar|gon\\.pk|gov\\.om|idf\\.il|net\\.cn|prd\\.fr|co\\.in|or\\.ug|red\\.sv|edu\\.lb|k12\\.ec|gx\\.cn|net\\.nz|info\\.hu|ac\\.zw|info\\.tt|com\\.ws|org\\.gg|com\\.et|ac\\.jp|ac\\.at|avocat\\.fr|org\\.ph|sark\\.gg|org\\.ve|tm\\.pl|net\\.pg|gov\\.co|com\\.lc|film\\.hu|ishikawa\\.jp|hotel\\.hu|hl\\.cn|edu\\.ge|com\\.bm|ac\\.om|tec\\.ve|edu\\.tr|cq\\.cn|com\\.pk|firm\\.in|inf\\.br|gunma\\.jp|gov\\.tn|oz\\.au|nf\\.ca|akita\\.jp|net\\.sd|tourism\\.pl|net\\.bb|or\\.at|idv\\.tw|dni\\.us|org\\.mx|conf\\.lv|net\\.jo|nic\\.in|info\\.vn|pe\\.kr|tw\\.cn|org\\.eg|ad\\.jp|hb\\.cn|kyonggi\\.kr|bourse\\.za|org\\.sb|gov\\.gg|net\\.br|mil\\.pe|kobe\\.jp|net\\.sa|edu\\.mt|org\\.vn|yokohama\\.jp|net\\.il|ac\\.cr|edu\\.sb|nagano\\.jp|travel\\.pl|gov\\.tr|com\\.sv|co\\.il|rec\\.br|biz\\.om|com\\.mm|com\\.az|org\\.vu|edu\\.ng|com\\.mx|info\\.co|realestate\\.pl|mil\\.sh|yamagata\\.jp|or\\.id|org\\.ae|greta\\.fr|k12\\.il|com\\.tw|gov\\.ve|arts\\.ve|cul\\.na|gov\\.kh|org\\.bm|etc\\.br|or\\.th|ch\\.vu|de\\.tt|ind\\.je|org\\.tw|nom\\.fr|co\\.tt|net\\.lc|intl\\.tn|shiga\\.jp|pvt\\.ge|gov\\.ua|org\\.pe|net\\.kh|co\\.vi|iwi\\.nz|biz\\.vn|gov\\.ck|edu\\.eg|zj\\.cn|press\\.ma|ac\\.in|eu\\.tt|art\\.do|med\\.ec|bbs\\.tr|gov\\.uk|edu\\.ua|eu\\.com|web\\.do|szex\\.hu|mil\\.kh|gen\\.nz|okinawa\\.jp|mob\\.nr|edu\\.ws|edu\\.sv|xj\\.cn|net\\.ru|dk\\.tt|erotika\\.hu|com\\.sh|cn\\.com|edu\\.pl|com\\.nc|org\\.il|arts\\.co|chirurgiens-dentistes\\.fr|net\\.pa|takamatsu\\.jp|net\\.ng|org\\.hu|net\\.in|net\\.vu|gen\\.tr|shop\\.hu|com\\.ae|tokushima\\.jp|za\\.com|gov\\.eg|co\\.jp|uba\\.ar|net\\.my|biz\\.et|art\\.br|ac\\.fk|gob\\.pe|com\\.bs|co\\.ae|de\\.net|net\\.eg|hyogo\\.jp|edunet\\.tn|museum\\.om|nom\\.ve|rnrt\\.tn|hn\\.cn|com\\.fk|edu\\.dz|ne\\.kr|co\\.je|sch\\.uk|priv\\.pl|sp\\.br|net\\.hk|name\\.vn|com\\.sa|edu\\.bm|qc\\.ca|bolt\\.hu|per\\.kh|sn\\.cn|mil\\.id|kagawa\\.jp|utsunomiya\\.jp|erotica\\.hu|gd\\.cn|net\\.tr|edu\\.np|asn\\.au|com\\.gu|ind\\.tn|mil\\.br|net\\.lb|nom\\.co|org\\.la|mil\\.pl|ac\\.il|gov\\.jo|com\\.kw|edu\\.sh|otc\\.au|gmina\\.pl|per\\.sg|gov\\.mo|int\\.ve|news\\.hu|sec\\.ps|ac\\.pg|health\\.vn|sex\\.pl|net\\.nc|qc\\.com|idv\\.hk|org\\.hk|gok\\.pk|com\\.ac|tochigi\\.jp|gsm\\.pl|law\\.za|pro\\.vn|edu\\.pe|info\\.et|sch\\.gg|com\\.vn|gov\\.bm|com\\.cn|mod\\.uk|gov\\.ps|toyama\\.jp|gv\\.at|yk\\.ca|org\\.et|suli\\.hu|edu\\.my|org\\.mm|co\\.yu|int\\.ar|pe\\.ca|tm\\.hu|net\\.sb|org\\.yu|com\\.ru|com\\.pe|edu\\.kh|edu\\.kw|org\\.qa|med\\.om|net\\.ws|org\\.in|turystyka\\.pl|store\\.ve|org\\.bs|mil\\.uy|net\\.ar|iwate\\.jp|org\\.nc|us\\.tt|gov\\.sh|nom\\.fk|go\\.th|gov\\.ec|com\\.br|edu\\.do|gov\\.ng|pro\\.tt|sapporo\\.jp|net\\.ua|tm\\.fr|com\\.lv|com\\.mo|edu\\.uk|fin\\.ec|edu\\.ps|ru\\.com|edu\\.ec|ac\\.fj|net\\.mm|veterinaire\\.fr|nom\\.re|ingatlan\\.hu|fr\\.vu|ne\\.jp|int\\.co|gov\\.cy|org\\.lv|de\\.com|nagasaki\\.jp|com\\.sb|gov\\.za|org\\.lc|com\\.fj|ind\\.in|or\\.cr|sc\\.cn|chambagri\\.fr|or\\.jp|forum\\.hu|tmp\\.br|reklam\\.hu|gob\\.sv|com\\.pl|saitama\\.jp|name\\.tt|niigata\\.jp|sklep\\.pl|nom\\.ni|co\\.ma|net\\.la|co\\.om|pharmacien\\.fr|port\\.fr|mil\\.gu|au\\.tt|edu\\.gu|ngo\\.ph|com\\.ve|ac\\.th|gov\\.fj|barreau\\.fr|net\\.ac|ac\\.je|org\\.kw|sport\\.hu|ac\\.cn|net\\.bm|ibaraki\\.jp|tel\\.no|org\\.cy|edu\\.mo|gb\\.net|kyoto\\.jp|sch\\.sa|com\\.au|edu\\.lc|fax\\.nr|gov\\.mm|it\\.tt|org\\.jo|nat\\.tn|mil\\.ve|be\\.tt|org\\.az|rec\\.co|co\\.ve|gifu\\.jp|net\\.th|hokkaido\\.jp|ac\\.gg|go\\.kr|edu\\.ye|qh\\.cn|ab\\.ca|org\\.cn|no\\.com|co\\.uk|gov\\.gu|de\\.vu|miasta\\.pl|kawasaki\\.jp|co\\.cr|miyagi\\.jp|org\\.jp|osaka\\.jp|web\\.za|net\\.za|gov\\.pk|gov\\.vn|agrar\\.hu|asn\\.lv|org\\.sv|net\\.sh|org\\.sa|org\\.dz|assedic\\.fr|com\\.sy|net\\.ph|mil\\.ge|es\\.tt|mobile\\.nr|co\\.kr|ltd\\.uk|ac\\.be|fgov\\.be|geek\\.nz|ind\\.gg|net\\.mt|maori\\.nz|ens\\.tn|edu\\.py|gov\\.sd|gov\\.qa|nt\\.ca|com\\.pg|org\\.kh|pc\\.pl|com\\.eg|net\\.ly|se\\.com|gb\\.com|edu\\.ar|sch\\.je|mil\\.ac|mil\\.ar|okayama\\.jp|gov\\.sg|ac\\.id|co\\.id|com\\.ly|huissier-justice\\.fr|nic\\.im|gov\\.lv|nu\\.ca|org\\.sg|com\\.kh|org\\.vi|sa\\.cr|lg\\.jp|ns\\.ca|edu\\.co|gov\\.im|edu\\.om|net\\.dz|org\\.pl|pp\\.ru|tm\\.mt|org\\.ar|co\\.gg|org\\.im|edu\\.qa|org\\.py|edu\\.uy|targi\\.pl|com\\.ge|gub\\.uy|gov\\.ar|ltd\\.gg|fr\\.tt|net\\.qa|com\\.np|ass\\.dz|se\\.tt|com\\.ai|org\\.ma|plo\\.ps|co\\.at|med\\.sa|net\\.sg|kanazawa\\.jp|com\\.fr|school\\.za|net\\.pl|ngo\\.za|net\\.sy|ed\\.jp|org\\.na|net\\.ma|asso\\.fr|police\\.uk|powiat\\.pl|govt\\.nz|sk\\.ca|tj\\.cn|mil\\.ec|com\\.jo|net\\.mo|notaires\\.fr|avoues\\.fr|aeroport\\.fr|yn\\.cn|gov\\.et|gov\\.sa|gov\\.ae|com\\.tt|art\\.dz|firm\\.ve|com\\.sd|school\\.nz|edu\\.et|gob\\.pa|telecom\\.na|ac\\.cy|gz\\.cn|net\\.kw|mobil\\.nr|nic\\.uk|co\\.th|com\\.vu|com\\.re|belgie\\.be|nl\\.ca|uk\\.com|com\\.om|utazas\\.hu|presse\\.fr|co\\.ck|xz\\.cn|org\\.tr|mil\\.co|edu\\.cn|net\\.ec|on\\.ca|konyvelo\\.hu|gop\\.pk|net\\.om|info\\.ve|com\\.ni|sa\\.com|com\\.tr|sch\\.sd|fukushima\\.jp|tel\\.nr|atm\\.pl|kitakyushu\\.jp|com\\.qa|firm\\.co|edu\\.tt|games\\.hu|mil\\.nz|cri\\.nz|net\\.az|org\\.ge|mie\\.jp|net\\.mx|sch\\.ae|nieruchomosci\\.pl|int\\.vn|edu\\.za|com\\.cy|wakayama\\.jp|gov\\.hk|org\\.pa|edu\\.au|gov\\.in|pro\\.om|2000\\.hu|szkola\\.pl|shimane\\.jp|co\\.zw|gove\\.tw|com\\.co|net\\.ck|net\\.pk|net\\.ve|org\\.ru|uk\\.net|org\\.co|uu\\.mt|com\\.cu|mil\\.za|plc\\.uk|lkd\\.co\\.im|gs\\.cn|sex\\.hu|net\\.je|kumamoto\\.jp|mil\\.lb|edu\\.yu|gov\\.ws|sendai\\.jp|eu\\.org|ah\\.cn|net\\.vn|gov\\.sb|net\\.pe|nagoya\\.jp|geometre-expert\\.fr|net\\.fk|biz\\.tt|org\\.sh|edu\\.sa|saga\\.jp|sx\\.cn|org\\.je|org\\.ye|muni\\.il|kochi\\.jp|com\\.bh|org\\.ec|priv\\.at|gov\\.sy|org\\.ni|casino\\.hu|res\\.in|uy\\.com)";
					res = tldRes[1] + tldStr + tldRes[3];
				}
				return res + "$";
			}).join('|');
			return new RegExp(regstr);
		},
		_isURLMatching: function(url) {
			return  !this._disabled && 
					 this._includeRegExp.test(url) &&
				   (!this._excludeRegExp || 
					!this._excludeRegExp.test(url));
		}
	};

	function log(str) {
		Services.console.logStringMessage(Array.slice(arguments));
	}

	function runScript(script, safeWindow) {
		//log('runScript0:'+script.name);
		//log('runScript1:'+safeWindow.location.href);
		if (!/^(?:https?|data|file|chrome):/.test(safeWindow.location.protocol))
				return;
	
		//log('runScript2:'+safeWindow.location.href);
		if (!script._isURLMatching(safeWindow.location.href))
			return false;

		//log('runScript3:'+safeWindow.location.href);
		if (safeWindow.USL_run.indexOf(script.name) >= 0) {
			log('DABUTTAYO!!!!! ' + script.name + safeWindow.location.href);
			return false;
		}
		//log('runScript:'+script.name);
		var unsafeWindow=safeWindow.wrappedJSObject;
		GM_import('pag/jquery.js',unsafeWindow);
		GM_import('pag/core.js',unsafeWindow);		
		GM_import(script._leafName,unsafeWindow);	
								
		safeWindow.USL_run.push(script.name);
	}
	
	function $(id) document.getElementById(id);
	function $E(xml, doc) {
		doc = doc || document;
		xml = <root xmlns={doc.documentElement.namespaceURI}/>.appendChild(xml);
		var settings = XML.settings();
		XML.prettyPrinting = false;
		var root = new DOMParser().parseFromString(xml.toXMLString(), 'application/xml').documentElement;
		XML.setSettings(settings);
		doc.adoptNode(root);
		var range = doc.createRange();
		range.selectNodeContents(root);
		var frag = range.extractContents();
		range.detach();
		return frag.childNodes.length < 2 ? frag.firstChild : frag;
	}

	
	function MasonDummyStreamListener(){}
	MasonDummyStreamListener.prototype = {
		originalListener: null,
		originalChannel: null,
		newChannel: null,
		onDataAvailable: function(request, context, inputStream, offset, count){},
		onStartRequest: function(request, context) {},
		onStopRequest: function(request, context, statusCode) {
			var xmlhttprequest = true;
			try{
				this.newChannel.asyncOpen(new MasonWrappedChannel(this.originalListener, this.originalChannel), context);
			}catch(e){
				//log("redirect error:" + e);
				with(this.originalListener){
					onStartRequest(request, context);
					onStopRequest(request, context, statusCode);
				}
				this.newChannel = null;
			}
		},
		QueryInterface: function (aIID) {
			if (aIID.equals(Ci.nsIStreamListener) ||aIID.equals(Ci.nsISupports) ) {
				return this;
			}else{
				throw Components.results.NS_NOINTERFACE;
			}
		}
	};

	function MasonWrappedChannel(oListener, oChannel){
		this.mListener = oListener;
		this.mChannel = oChannel;
	}
	MasonWrappedChannel.prototype = {
		mListener: null,
		mChannel: null,
		mRequest: null,
		
		onDataAvailable: function(request, context, inputStream, offset, count){
			//log("data magic:" + request);
			this.mListener.onDataAvailable(request, context, inputStream, offset, count);
		},
		onStartRequest: function(request, context) {
			//log("start magic:" + request);
			try{
				this.mListener.onStartRequest(request, context);
			}catch(e){
				log(e);
			}
		},
		onStopRequest: function(request, context, statusCode) {
			//log("stop magic:" + request);
			this.mRequest = request;
			this.mListener.onStopRequest(request, context, statusCode);
			//xhr need another stop
			this.mListener.onStopRequest(this, context, statusCode);
		},
	  
		//nsIMultiPartChannel
		get baseChannel(){
			//log(this.mChannel);
			return this.mChannel;
		},
		  
		get contentDisposition(){return "true";},
		get isLastPart(){return true;},
		get partID(){return 1;},
	  
		//nsIRequest
		get loadFlags(){return this.mRequest.loadFlags;},
		set loadFlags(arg){this.mRequest.loadFlags = arg; },
		get loadGroup(){return this.mRequest.loadGroup;},
		set loadGroup(arg){this.mRequest.loadGroup = arg;},

		get name(){return this.mRequest.name;},
		get status(){return this.mRequest.status;},
		cancel : function(){return this.mRequest.cancel();},
		isPending : function(){return this.mRequest.isPending();},
		resume: function(){return this.mRequest.resume();},
		suspend: function(){return this.mRequest.suspend();},
	  
		//nsIChannel
		get URI(){return this.mRequest.URI;},
		get contentCharset(){return this.mRequest.contentCharset;},
		get contentLength(){return this.mRequest.contentLength;},
		get contentType(){return this.mRequest.contentType;},
		get notificationCallbacks() {return this.mRequest.notificationCallbacks;},
		set notificationCallbacks(arg){this.mRequest.notificationCallbacks = arg;},
		get originalURI(){return this.mRequest.originalURI;},
		get owner(){return this.mRequest.owner;},
		set owner(arg){this.mRequest.owner = arg;},
		get securityInfo(){return this.mRequest.securityInfo;},
		asyncOpen: function(aListener, aContext){},
		open: function(){},
		QueryInterface: function (aIID) {
			if (aIID.equals(Ci.nsIStreamListener) || Components.interfacesaIID.equals(Ci.nsISupports) 
					||aIID.equals(Ci.nsIMultiPartChannel) ||aIID.equals(Ci.nsIRequest)){
				//log("queryMPChannel=" + aIID.equals(Ci.nsIMultiPartChannel));
				return this;
			}else{
				//log("queryOtherChannel=" +  aIID);
				try{
					var result = this.mRequest.QueryInterface(aIID);
					//log("queryOtherChannelResult=" +  result);
					return result;
				}catch(e){
					//log("queryOtherChannelErr=" +  e);
					throw Components.results.NS_NOINTERFACE;
				}
			}
		}
	};

	function masonRedirect(subject,newURL){
		try{
			subject.suspend();
		}catch(e){
			log(e);
		}
		var nc;
		try{
			nc = Services.io.newChannel(newURL, null, null);
		}catch(e){
			log(e);return;
		}					
		var newListener = new MasonDummyStreamListener();
		subject.QueryInterface(Ci.nsITraceableChannel);
		newListener.originalListener = subject.setNewListener(newListener);
		newListener.originalChannel = subject;
		try{
			nc.owner = subject.owner;
			subject.owner = null;
		}catch(e){
			log("redirect failure:" + e);
		}
		subject.notificationCallbacks = null;
		nc.notificationCallbacks = subject.notificationCallbacks;
		newListener.newChannel = nc;
		try{
			subject.resume();
		}catch(e){}
		subject.cancel(Cr.NS_NOINTERFACE);
	}

	var GM_myObserver={
		config:{'request':{'work':[]},'response':{'work':[]}},
		register: function() {
			Services.obs.addObserver(this, 'http-on-modify-request', false);
			Services.obs.addObserver(this, 'http-on-examine-response', false);
		},
		unregister: function() {
			Services.obs.removeObserver(this, 'http-on-modify-request');
			Services.obs.removeObserver(this, 'http-on-examine-response');
		},
		add:function (req,url,method,a,b,weight){
			weight=weight||0;
			var config=this.config[req];
			config[url]=config[url]||{};
			config[url]['re']=ScriptEntry.prototype._createRegExp(url);
			config[url]['weight']=weight;
			config[url][method]=config[url][method]||{};
			config[url][method][a]=b;
			
			var index=config['work'].indexOf(url);
			if(index!=-1){
				config['work'].splice(index,1);
			}
			for(var i=0,l=config['work'].length;i<l;i++){
				if(config[config['work'][i]].weight>weight){
					break;
				}
			}
			config['work'].splice(i,0,url);
		},
		del:function(req,url){
			delete this.config[req][url];
			var work=this.config[req]['work'];
			var index=work.indexOf(url);
			if(index!=-1){
				work.splice(index,1);
			}
		},
		clear:function(){
			this.config={'request':{'work':[]},'response':{'work':[]}};
		}
	}
	
	GM_myObserver['observe']=(function(config){
		return function(subject, topic, data) {
			var url,tmp,head,set,get;
			switch (topic) {
				case 'http-on-modify-request' :
					subject.QueryInterface(Ci.nsIHttpChannel);
					//log(file.path);
					var work=config.request.work;
					for(var i=0,l=work.length;i<l;i++){
						url=work[i];
						//log(url);
						tmp=config.request[url];
						if(url==subject.URI.asciiSpec||tmp['re'].test(subject.URI.asciiSpec)){
							if(tmp.get){
								get=tmp.get;
								for(head in get){
									if(typeof get[head]=="function"){
										get[head](subject.getRequestHeader(head));
									}else{
										//log(head);
										subject.setRequestHeader(get[head],subject.getRequestHeader(head),false);
										subject.setRequestHeader(head,null,false);
									}	
								}
							}
							if(tmp.set){
								set=tmp.set;
								for(head in set){
									if(head.toLowerCase()!='location'){
										subject.setRequestHeader(head,subject.getRequestHeader(set[head]),false);
									}else{
										if(typeof set[head]=="function"){
											var newURL=set[head](subject.URI.asciiSpec);
										}else if(set[head].indexOf('import:')==0){
											var newURL='file:'+ns.SCRIPTS_FOLDER.path+'\\'+set[head].replace('import:','');
										}else{
											var newURL=set[head]
										}
										if(newURL!='')
											setTimeout(masonRedirect, 0,subject,newURL);
									}
								}
							}
						}
						
					}
					break; 
				case 'http-on-examine-response':
					subject.QueryInterface(Ci.nsIHttpChannel);	
					var work=config.response.work;
					for(var i=0,l=work.length;i<l;i++){
						url=work[i];
						tmp=config.response[url];
						if(url==subject.URI.asciiSpec||tmp['re'].test(subject.URI.asciiSpec)){	
							//log(url);
							if(tmp.get){
								get=tmp.get;
								for(head in get){
									try{
										if(typeof get[head]=="function"){
											get[head](subject.getResponseHeader(head));
										}else{
											subject.setResponseHeader(get[head],subject.getResponseHeader(head),false);
											subject.setResponseHeader(head,null,false);
										}
									}catch(e){
									}
								}
							}
							if(tmp.set){
								set=tmp.set;
								for(head in set){
									subject.setResponseHeader(head,set[head],false);
								}
							}
						}
					}
					break; 
				default :
					break;
			}
		}
	})(GM_myObserver.config);
	GM_myObserver.register();
	
	function GM_getRequest(){
		var request = Cc['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance();
		request.QueryInterface(Ci.nsIDOMEventTarget);
		request.QueryInterface(Ci.nsIXMLHttpRequest);
		return request;
	}

	function GM_DB(f){
		var mDBConn=null;
		return {
			'open': function() {
				if(f.indexOf('file:')==0){
					var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
					file.initWithPath(f.replace(/file:\/+/,''));
				}else{
					var file = Cc["@mozilla.org/file/directory_service;1"]
						.getService(Ci.nsIProperties)
						.get("UChrm", Ci.nsILocalFile);
					file.append(f);
				}
				mDBConn = Services.storage.openDatabase(file);
				return this;
			},
			'close': function() {
				mDBConn.close();
				mDBConn=null;
				return this;
			},
			'exeSQL': function(sql ) {
				mDBConn.executeSimpleSQL(sql);
				return this;
			},
			'getData': function(sql ,config) {
				var statement =mDBConn.createStatement(sql),res=[],i=0,l=config.length,temp;	
				try {
					while (statement.step()) {
						temp=[];
						for(i=0;i<l;i++){
							if(config[i]==0){
								temp.push(statement.getString(i));
							}
							if(config[i]==1){
								temp.push(statement.getInt32(i));
							}	
						}
						res.push(temp);
					}
				}finally {
					statement.finalize();	
				}
				return res;
			}
		}
	}


	function GM_Pref(startPoint) {
		var pref = Services.prefs.getBranch(startPoint);
		return {
			exists : function(prefName) {
				return pref.getPrefType(prefName) != 0;
			},
			listValues : function() {
				return pref.getChildList("", {});
			},
			getValue : function(prefName, defaultValue) {
				var prefType = pref.getPrefType(prefName);
				if (prefType == pref.PREF_INVALID) {
				  return defaultValue;
				}
				try {
					switch (prefType) {
						case pref.PREF_STRING:
							return pref.getComplexValue(prefName, Ci.nsISupportsString).data;
						case pref.PREF_BOOL:
							return pref.getBoolPref(prefName);
						case pref.PREF_INT:
							return pref.getIntPref(prefName);
					}
				} catch(ex) {
					return defaultValue != undefined ? defaultValue : null;
				}
				return null;
			},
			setValue : function(prefName, value) {
				var prefType = typeof(value);
				var goodType = false;

				switch (prefType) {
					case "string":
					case "boolean":
						goodType = true;
						break;
					case "number":
						if (value % 1 == 0 &&value >= -0x80000000 &&value <= 0x7FFFFFFF) {
								goodType = true;
						}
						break;
				}
				if (!goodType) {
				  throw new Error("Unsupported type for GM_setValue. Supported types " +
								  "are: string, bool, and 32 bit integers.");
				}
				if (this.exists(prefName) && prefType != typeof(this.getValue(prefName))) {
					this.remove(prefName);
				}
				// set new value using correct method
				switch (prefType) {
					case "string":
						var str = Cc["@mozilla.org/supports-string;1"]
										.createInstance(Ci.nsISupportsString);
						str.data = value;
						pref.setComplexValue(prefName, Ci.nsISupportsString, str);
						break;
					case "boolean":
						pref.setBoolPref(prefName, value);
						break;
					case "number":
						pref.setIntPref(prefName, Math.floor(value));
						break;
				}
			},
			remove : function(prefName) {
				prefName=prefName||'';
				pref.deleteBranch(prefName);
			}
		}
	}

	function toHexString(charCode){
		return ("0" + charCode.toString(16)).slice(-2);
	}
	function GM_MD5(str){
		var converter =Cc["@mozilla.org/intl/scriptableunicodeconverter"]
						.createInstance(Ci.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		var ch = Cc["@mozilla.org/security/hash;1"]
			 .createInstance(Ci.nsICryptoHash);
		var result = {};
		var data = converter.convertToByteArray(str, result);
		ch.init(ch.MD5);
		ch.update(data, data.length);
		var hash = ch.finish(false);
		return([toHexString(hash.charCodeAt(i)) for (i in hash)].join(""));
	}

	function GM_convert(unicode_str){
		var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"]
					.createInstance(Ci.nsIScriptableUnicodeConverter);
		converter.charset = 'GBK';  
		var gbk_str = converter.ConvertFromUnicode(unicode_str),s=''; 
		for(var i=0,len=gbk_str.length;i<len;i++){
			s+="%"+gbk_str.charCodeAt(i).toString(16);
		}
		return s;
	}

	function GM_import(url,obj,type,ext) {
		type=type||"file",ext=ext||/\.js$/i;
		var loader = Services.scriptloader;
		if(type=="file"){
			loader.loadSubScript('file:'+ns.SCRIPTS_FOLDER.path+'\\'+url,obj,"gbk");
		}else if(type=="directory"){//相对UserScriptLoader
			var aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile)
			aFolder.initWithPath(ns.SCRIPTS_FOLDER.path);
			aFolder.appendRelativePath(url);
			var files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
			while (files.hasMoreElements()) {
				let file = files.getNext().QueryInterface(Ci.nsIFile);
				//log(file.path);
				if (ext.test(file.leafName))
					loader.loadSubScript('file:'+file.path,obj,"gbk");
			}
		}else{
			if(url=="{}"){
				obj={};
			}else if(url=="[]"){
				obj=[];
			}else{
				var _obj=JSON.parse(url);
				for(var i in _obj){
					obj[i]=_obj[i];
					delete _obj[i];
				}
				delete _obj;
			}
		}	
	}

	var GM_cmgr = Services.cookies;
	var cookie={
		getStr:function(host,path,name) {
			var enumerator = GM_cmgr.enumerator;
			while (enumerator.hasMoreElements()) {
				let nextCookie = enumerator.getNext();
				nextCookie = nextCookie.QueryInterface(Ci.nsICookie);
				if(nextCookie.host==host&&nextCookie.path==path&&nextCookie.name==name){
					return nextCookie.value;
				}
			}
			return '';	
		},
		get:function(host,path) {
			var enumerator = GM_cmgr.enumerator,s='';
			while (enumerator.hasMoreElements()) {
				let nextCookie = enumerator.getNext();
				nextCookie = nextCookie.QueryInterface(Ci.nsICookie);
				if(nextCookie.host==host&&nextCookie.path==path){
					s+=nextCookie.name+'='+nextCookie.value+';';
				}
			}
			return s;	
		},
		remove:function(host,path) {
			var enumerator = GM_cmgr.enumerator;
			while (enumerator.hasMoreElements()) {
				let nextCookie = enumerator.getNext();
				nextCookie = nextCookie.QueryInterface(Ci.nsICookie);
				if(nextCookie.host==host&&nextCookie.path==path){
					GM_cmgr.remove(nextCookie.host,nextCookie.name,nextCookie.path,false);
				}
			}
		},
		list:function(){
			var enumerator = GM_cmgr.enumerator,a=[];
			while (enumerator.hasMoreElements()) {
				let nextCookie = enumerator.getNext();
				nextCookie = nextCookie.QueryInterface(Ci.nsICookie);
				a.push(nextCookie.host+':'+nextCookie.path+':'+nextCookie.name+'='+nextCookie.value+';');
			}
			return a;
		},
		add:function(host,path,str){
			var a=str.split(';');
			for(var i=0,l=a.length;i<l;i++){
				let tmp=a[i].split('=');
				if(tmp.length>=2){
					GM_cmgr.add(host,path,tmp.shift(),tmp.join('='),false,false,false,Math.round((new Date()).getTime() / 1000 + 9999999999));
				}
			}
		},
		getHost:function(a) {
			var enumerator = GM_cmgr.enumerator,s='',obj={};
			while (enumerator.hasMoreElements()) {
				let nextCookie = enumerator.getNext();
				nextCookie = nextCookie.QueryInterface(Ci.nsICookie);
				if(a.indexOf(nextCookie.host)!=-1){
					let key=nextCookie.host+nextCookie.path;
					obj[key]=obj[key]||'';
					obj[key]+=nextCookie.name+'='+nextCookie.value+';';
				}
			}
			return obj;	
		},
		removeHost:function(a){
			var enumerator = GM_cmgr.enumerator;
			while (enumerator.hasMoreElements()) {
				let nextCookie = enumerator.getNext();
				nextCookie = nextCookie.QueryInterface(Ci.nsICookie);
				if(a.indexOf(nextCookie.host)!=-1){
					GM_cmgr.remove(nextCookie.host,nextCookie.name,nextCookie.path,false);
				}
			}
		},
		clear:function(){
			GM_cmgr.removeAll();
		}
	}
	
	function GM_ckManage(a){
		a=a||[];
		var _a=[];
		function init(a){
			_a=[];
			a.forEach(function(v){
				let t=v.split('/');
				_a.push([t.shift(),'/'+t.join('/')]);
			})
			return this;
		}
		init(a);
		return {
			'init':init,
			'remove':function(){
				_a.forEach(function(v){
					cookie.remove(v[0],v[1]);
				});
				return this;
			},
			'get':function(extr){
				var obj={};
				for(var i in extr){
					obj[i]=extr[i];
				}
				_a.forEach(function(v,i){
					obj[v.join('')]=cookie.get(v[0],v[1]);
				});
				return obj;
			},
			'set':function(obj){
				_a.forEach(function(v,i){
					cookie.add(v[0],v[1],obj[v.join('')]);
				});
				return this;
			}
		}
	}

	function GM_ckManage2(a){
		a=a||[];
		return {
			'init':function(b){
				a=b;
			},
			'remove':function(){
				if(a.length>0){
					cookie.removeHost(a);
				}
				return this;
			},
			'get':function(){
				if(a.length>0){
					return cookie.getHost(a);
				}
				return '';
			},
			'set':function(obj){
				for(var i in obj){
					let t=i.split('/');
					cookie.add(t.shift(),'/'+t.join('/'),obj[i]);
				}
				return this;
			}
		}
	}

	/*
	const proxyService = Cc['@mozilla.org/network/protocol-proxy-service;1'].getService(Ci.nsIProtocolProxyService);
	var GM_myProxy={
		'proxyMode':'disabled',
		'server':{},
		'work':[],
		'direct': proxyService.newProxyInfo('direct', '', -1, 0, 0, null),
		'defaultProxy':proxyService.newProxyInfo('direct', '', -1, 0, 0, null),
		'applyFilter': function(pS, uri, aProxy){
			if (this.proxyMode == 'disabled' || uri.schemeIs('feed'))
			  return this.direct;
			
			var work=this.work,l=work.length;
			while(l--){
				url=work[l];
				tmp=this.server[url];
				if(url==uri.asciiSpec||tmp['re'].test(uri.asciiSpec)){	
					return tmp.proxy;
				}
			}
			return this.defaultProxy;
		},
		'setDef':function(conf){
			this.defaultProxy=proxyService.newProxyInfo(conf.type, conf.host, conf.port, 1, 0, null);
		},
		'add':function(url,conf,weight){
			weight=weight||0;
			this.server[url]={};
			this.server[url]['proxy']=proxyService.newProxyInfo(conf.type, conf.host, conf.port, 1, 0, null);
			this.server[url]['re']=ScriptEntry.prototype._createRegExp(url);
			this.server[url]['weight']=weight;
			
			var index=this.work.indexOf(url);
			if(index!=-1){
				this.work.splice(index,1);
			}
			for(var i=0,l=this.work.length;i<l;i++){
				if(this.server[this.work[i]].weight>weight){
					break;
				}
			}
			this.work.splice(i,0,url);
		},
		'del':function(url){
			delete this.server[url];
			var index=this.work.indexOf(url);
			if(index!=-1){
				this.work.splice(index,1);
			}
		}
	}
	proxyService.registerFilter(GM_myProxy, 0);
	*/
	
	function GM_saveCanvas(canvas,filepath){
		var file = Components.classes["@mozilla.org/file/local;1"]
						   .createInstance(Ci.nsILocalFile);
		file.initWithPath(filepath); 
		var io = Components.classes["@mozilla.org/network/io-service;1"]
						 .getService(Ci.nsIIOService);
		var source = io.newURI(canvas.toDataURL("image/png", ""), "UTF8", null);
		var target = io.newFileURI(file)
		var persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"]
							  .createInstance(Ci.nsIWebBrowserPersist);
		persist.persistFlags = Ci.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
		persist.persistFlags |= Ci.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
		persist.saveURI(source, null, null, null, null, file);
	}
	
	function GM_runProc(path,args,blocking){
		try{
			if(path.indexOf('cmd:')==0){
				var winDir = Components.classes["@mozilla.org/file/directory_service;1"].
								getService(Ci.nsIProperties).get("WinD", Ci.nsILocalFile); 
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
				file.initWithPath(winDir.path + "\\system32\\" +path.replace('cmd:',''));
			}else{
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
				file.initWithPath(path);
			}
			var process=Components.classes['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
			process.init(file);
			args = args||[''];
			blocking =blocking||false;
			process.run(blocking,args,args.length);
		}catch(e){log(e);}
	}

	function GM_getFiles(path){
		var str=[];
		var aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		aFolder.initWithPath(path);
		var files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
		while(files.hasMoreElements()){
			let file = files.getNext().QueryInterface(Ci.nsIFile);
			str.push(file.leafName);
		}
		return str.join(',');
	}

	var FileIO = {
		localfileCID  : '@mozilla.org/file/local;1',
		localfileIID  : Ci.nsILocalFile,
		finstreamCID  : '@mozilla.org/network/file-input-stream;1',
		finstreamIID  : Ci.nsIFileInputStream,
		foutstreamCID : '@mozilla.org/network/file-output-stream;1',
		foutstreamIID : Ci.nsIFileOutputStream,
		sinstreamCID  : '@mozilla.org/scriptableinputstream;1',
		sinstreamIID  : Ci.nsIScriptableInputStream,
		suniconvCID   : '@mozilla.org/intl/scriptableunicodeconverter',
		suniconvIID   : Ci.nsIScriptableUnicodeConverter,
		open   : function(path) {
			try {
				var file = Components.classes[this.localfileCID]
								.createInstance(this.localfileIID);
				file.initWithPath(path);
				return file;
			}catch(e) {
				return false;
			}
		},
		exists:function(file){
			return file.exists();
		},
		read   : function(file, charset) {
			try {
				var data     = new String();
				var fiStream = Components.classes[this.finstreamCID]
									.createInstance(this.finstreamIID);
				var siStream = Components.classes[this.sinstreamCID]
									.createInstance(this.sinstreamIID);
				fiStream.init(file, 1, 0, false);
				siStream.init(fiStream);
				data += siStream.read(-1);
				siStream.close();
				fiStream.close();
				if (charset) {
					data = this.toUnicode(charset, data);
				}
				return data;
			}catch(e) {
				return false;
			}
		},
		write  : function(file, data, mode, charset) {
			try {
				var foStream = Components.classes[this.foutstreamCID]
									.createInstance(this.foutstreamIID);
				if (charset) {
					data = this.fromUnicode(charset, data);
				}
				var flags = 0x02 | 0x08 | 0x20; // wronly | create | truncate
				if (mode == 'a') {
					flags = 0x02 | 0x10; // wronly | append
				}
				foStream.init(file, flags, 0664, 0);
				foStream.write(data, data.length);
				foStream.close();
				return true;
			}catch(e) {
				return false;
			}
		},
		create : function(file) {
			try {
				file.create(0x00, 0664);
				return true;
			}catch(e) {
				return false;
			}
		},
		unlink : function(file) {
			try {
				file.remove(false);
				return true;
			}catch(e) {
				return false;
			}
		},
		path   : function(file) {
			try {
				return 'file:///' + file.path.replace(/\\/g, '\/')
							.replace(/^\s*\/?/, '').replace(/\ /g, '%20');
			}catch(e) {}
		},
		toUnicode   : function(charset, data) {
			try{
				var uniConv = Components.classes[this.suniconvCID]
									.createInstance(this.suniconvIID);
				uniConv.charset = charset;
				data = uniConv.ConvertToUnicode(data);
			}catch(e) {}
			return data;
		},
		fromUnicode : function(charset, data) {
			try {
				var uniConv = Components.classes[this.suniconvCID]
									.createInstance(this.suniconvIID);
				uniConv.charset = charset;
				data = uniConv.ConvertFromUnicode(data);
			}catch(e) {}
			return data;
		}

	}
	var DirIO = {
		sep        : '/',
		dirservCID : '@mozilla.org/file/directory_service;1',
		propsIID   : Ci.nsIProperties,
		fileIID    : Ci.nsIFile,
		get    : function(type) {
			try {
				var dir = Components.classes[this.dirservCID]
								.createInstance(this.propsIID)
								.get(type, this.fileIID);
				return dir;
			}catch(e) {
				return false;
			}
		},
		open   : function(path) {
			return FileIO.open(path);
		},
		create : function(dir) {
			try {
				dir.create(0x01, 0664);
				return true;
			}catch(e) {
				return false;
			}
		},
		read   : function(dir, recursive) {
			var list = new Array();
			try {
				if (dir.isDirectory()) {
					if (recursive == null) {
						recursive = false;
					}
					var files = dir.directoryEntries;
					list = this._read(files, recursive);
				}
			}catch(e) {}
			return list;
		},
		_read  : function(dirEntry, recursive) {
			var list = new Array();
			try {
				while (dirEntry.hasMoreElements()) {
					list.push(dirEntry.getNext()
						.QueryInterface(FileIO.localfileIID));
				}
				if (recursive) {
					var list2 = new Array();
					for (var i = 0; i < list.length; ++i) {
						if (list[i].isDirectory()) {
							files = list[i].directoryEntries;
							list2 = this._read(files, recursive);
						}
					}
					for (i = 0; i < list2.length; ++i) {
						list.push(list2[i]);
					}
				}
			}catch(e) {}
			return list;
		},
		unlink : function(dir, recursive) {
			try {
				if (recursive == null) {
					recursive = false;
				}
				dir.remove(recursive);
				return true;
			}
			catch(e) {
				return false;
			}
		},
		path   : function (dir) {
			return FileIO.path(dir);
		},
		split  : function(str, join) {
			var arr = str.split(/\/|\\/), i;
			str = new String();
			for (i = 0; i < arr.length; ++i) {
				str += arr[i] + ((i != arr.length - 1) ? join : '');
			}
			return str;
		},
		join   : function(str, split) {
			var arr = str.split(split), i;
			str = new String();
			for (i = 0; i < arr.length; ++i) {
				str += arr[i] + ((i != arr.length - 1) ? this.sep : '');
			}
			return str;
		}
	}
	if (navigator.platform.toLowerCase().indexOf('win') > -1) {
		DirIO.sep = '\\';
	}

	var gw={
		'cache':{},
		'ob':GM_myObserver,
		'cookie':cookie,
		'addTab':function(url){
			gBrowser.addTab(url); 
		},
		'ckManage':GM_ckManage,
		'ckManage2':GM_ckManage2,
		'pref':GM_Pref,
		'db':GM_DB,
		'req':GM_getRequest,
		'clip':function(str) {
			if (str.constructor === String ||str.constructor === Number) {
				Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper).copyString(str);
			}
		},
		'drawWindow':function(o,win,x,y,w,h){
			o.drawWindow(win,x,y,w,h,"rgb(255,255,255)");
		},
		'getImgData':function (o,w,h){
			return o.getImageData(0, 0,w,h);
		},
		'md5':GM_MD5,
		'import':GM_import,
		'convert':GM_convert,
		'saveC':GM_saveCanvas,
		'cmd':GM_runProc,
		//'proxy':GM_myProxy,
		'getFile':GM_getFiles,
		'FileIO':FileIO,
		'DirIO':DirIO
	};
	(function(){
		var db=GM_DB('login.sqlite'),cache=gw.cache;
		var data=db.open().getData("select * from login where islog=1 order by host,user",[0,0,1,0]);
		db.close();
		data.forEach(function(v){
			cache[v[0]]=cache[v[0]]||{'tidInfos':{},'useInfos':{}};
			cache[v[0]]['useInfos'][v[1]]=JSON.parse(v[3]);
		});	
	})();
})();
window.UserScriptLoader.init();