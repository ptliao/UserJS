	var userjs = {};
	Components.utils.import('chrome://UserJS/content/require.js', userjs);
	Components.utils.import("resource://gre/modules/PlacesUtils.jsm");
	Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
	var Ci = userjs.Ci, Cc = userjs.Cc;
	const PTV_interfaces = [Ci.nsITreeView,
                        Ci.nsINavHistoryResultObserver,
                        Ci.nsINavHistoryResultTreeViewer,
                        Ci.nsISupportsWeakReference];
	
	var console = userjs.console;
	var require = userjs.require;
	var DateBase  = require('DateBase');
	var db = new DateBase('USL://datebase/places.sqlite').open();
	
	document.getElementById("placeContent").ondragstart = function (event) {
		let dt = event.dataTransfer;
		dt.effectAllowed = "copyLink";	
		let nodes = [];
		let selection = this.view.selection;
		let rc = selection.getRangeCount();
		let index = 0;
		for (let i = 0; i < rc; ++i) {
			let min = { }, max = { };
			selection.getRangeAt(i, min, max);
			for (let j = min.value; j <= max.value; ++j) {
				dt.mozSetDataAt("text/plain", j, index++);
			}
		}
        event.stopPropagation();
	};
	document.getElementById("placeContent").ondragover = function (event) {
		console.log("placeContent ondragover");
        event.preventDefault();
        event.stopPropagation();
	};
	document.getElementById("placeContent").ondragend = function (event) {
		console.log("placeContent ondragend");
        event.preventDefault();
        event.stopPropagation();
	};
	console.log("select * from moz_bookmarks ");
	var PlacesOrganizer = {
		init : function () {
		},
		destroy: function () {
		},
		updateDetailsPane1: function () {
			console.log('updateDetailsPane1')
		},
		updateDetailsPane2: function () {
			console.log('updateDetailsPane2')
		},
		openFlatContainer: function () {
			console.log('openFlatContainer')
		},
		onClick: function () {
			console.log('onClick')
		},
		onKeyPress: function () {
		}
	};
	var bookmarks = [];
	db.exeSQLAsync("select * from moz_bookmarks where parent = 2343;", {} ,function (mess, res) {
		if (mess == 'OK') {
			for (let i = 0, len = res.length; i < len; i++) {
				let bookmark = res[i];
				bookmarks.push(bookmark);
			}
		} else if (mess == 'Completion' || mess == 'Error') {
			document.getElementById("placeContent").view = new TreeView(bookmarks);
		}
	});
	function TreeView(bookmarks) {
		this.bookmarks = bookmarks;
	}
	TreeView.prototype = {
		get wrappedJSObject() this,
		__dateService: null,
		get _dateService() {
			if (!this.__dateService) {
				this.__dateService = Cc["@mozilla.org/intl/scriptabledateformat;1"].
										getService(Ci.nsIScriptableDateFormat);
			}
			return this.__dateService;
		},

		QueryInterface: XPCOMUtils.generateQI(PTV_interfaces),
		classInfo: XPCOMUtils.generateCI({ interfaces: PTV_interfaces }),

		treeBox: null,
		selection: null,
		get rowCount() {
			return this.bookmarks.length; 
		},
		setTree: function(treeBox) {
			this.treeBox = treeBox; 
		},
		nodeForTreeIndex: function (aIndex) {
			if (aIndex > this.bookmarks.length)
				throw Cr.NS_ERROR_INVALID_ARG;
			return this._getNodeForRow(aIndex);
		},
		_getNodeForRow: function (aRow) {
			return document.getElementById("placeContent").getChild(aRow)
		},
		getCellText: function(idx, column) {
			var anonid = column.element.getAttribute("anonid");
			return this.bookmarks[idx][anonid] || "";
		},
		isContainer: function(row){ return false; },
		isSeparator: function(row){ return false; },
		isSorted: function(){ return false; },
		getLevel: function(row){ return 0; },
		getImageSrc: function (row, col) {
			if (col.id == "placesContentTitle")
				return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgZJREFUeNqMkztoVEEUhv+7m2sgChJsFLXIFpqAUUyRRsS10UIhTToLAzaWWrvg2tnZCCJYBGwUJCgSbSMqoo2yplgbH0ExnSDmzsydl/+cfUjCLmbg3JnDzPnOf87MzWKMaDQapwDUrbVzeZ4f54zvu6ZgSgdNU6XlbGVtrENJcz7g84NmNoLOqNOa5xau4ujEXmxnzCw0Ze4BxFtevIW728i8eP1yHySAarWKGAMqWYba5DRK5xnguxAnQMOyjLFor76XwFR6H2DLUhzvPaohIjCLJ8TRD95xzczOir91VNKnJMDaZJYyPSwDLAFHDu5hYPItvO1Aepk3AbRR0FpToqZ8KyUk2PyJSYxkkQqt+CnJQAVGaWhFiCpQsk5DRWdnahgbzXHh9DR2sNCSAE/Q1iE9UAzMuj2oT+3H+dlD/QOzhw+IPXrRwtM3q/j5YwCgKP4QUJH6lt+28erjV9y8dKZ/6Nq9Z3jX/iYNHViCLgqRr4oNKG2weyyXzaWXLZkn9o3DpSY7N6QENjCVEEKAI2B85yiu3H6MT2vrWFr5gJPHarwBJ/sDAUmB9IBvwCqDJ69b7Djvn5LXqOr+83UJHgowWnVfF+B4lV4eTwrwHfPddRwCcLyiJEH2eVUhuH9BzBpT9ug5dx7RxeadzQAeXCGgDu5v/P713z/xy8MbWW/9V4ABABX3fg9RweLRAAAAAElFTkSuQmCC"; 
			return null;
		},
		cycleCell: function(row, col) {
			console.log("cycleCell");
		},
		cycleHeader: function (column) {
			console.log("cycleHeader");
		},
		canDrop: function () {
			return true;
		},
		drop: function (aRow, aOrientation, aDataTransfer) {
			console.log(aRow);
			console.log(aOrientation);
			console.log(aDataTransfer);
		},
		getRowProperties: function(row,props){},
		getCellProperties: function(row,col,props){},
		getColumnProperties: function(colid,col,props){}
	}