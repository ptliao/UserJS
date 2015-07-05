const EXPORTED_SYMBOLS = ['DateBase'];

//https://developer.mozilla.org/en/Storage

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/PATH_MANAGE.js');

/*
(function () {
	let file = Services.dirsvc.get('UChrm', Ci.nsILocalFile);
	file.appendRelativePath('UserLib');
	let UserLibPath = Cc["@mozilla.org/network/protocol;1?name=file"].
					getService(Ci.nsIFileProtocolHandler).
					getURLSpecFromFile(file);		
	Cu.import(UserLibPath + 'require.js');
})();*/

function DateBase (url) {
	if (!(this instanceof DateBase)) {
		return new DateBase(url);
	} else {
		//console.log(PATH_MANAGE.getFilePath(path));
		//console.log(PATH_MANAGE.getFilePath(path).replace(/file:\/+/,''));
		this.path = PATH_MANAGE.urlToPath(url).replace(/file:\/+/,'');
	}
}
DateBase.prototype = {
	open: function () {
		try {
			this.close();
		} catch (e) {
		}
		let file = Components.classes["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
		file.initWithPath(this.path);
		this.mDBConn = Services.storage.openDatabase(file);
		return this;
	},
	SQL: function (sql) {
		this.mDBConn.executeSimpleSQL(sql);
		return this;
	},
	close: function () {
		this.mDBConn.close();
		this.mDBConn=null;
		return this;
	},
	exeSQL: function (sql, params) {
		let statement = this.mDBConn.createStatement(sql);		
		let columns = [];
		for (let i = 0, len = statement.columnCount; i < len; i++) {
			columns.push(statement.getColumnName(i));
		}
		
		if (!!params) {	
			let i;
			for (i in params) {
				statement.params[i] = params[i];
			}
		}
		
		let re = [] ;	
		try {
			while (statement.executeStep()) {
				let row = statement.row, obj = {};
				for(let i = 0, len = columns.length; i < len; i++) {
					obj[columns[i]] = row[columns[i]];
				}
				re.push(obj);
			}
		}finally {
			statement.finalize();	
		}
		return re;
	},
	exeSQLAsync: function (sql, params ,callback) {
		let statement = this.mDBConn.createStatement(sql);		
		let columns = [];
		for (let i = 0, len = statement.columnCount; i < len; i++) {
			columns.push(statement.getColumnName(i));
		}
		
		if (!!params) {	
			let i;
			for (i in params) {
				statement.params[i] = params[i];
			}
		}
		
		let re = [] ;
		if (!!callback) {
			statement.executeAsync({
				handleResult: function(aResultSet) {
					let re = [] ;
					for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
						let obj = {};
						for(let i = 0, len = columns.length; i < len; i++) {
							obj[columns[i]] = row.getResultByName(columns[i]);
						}
						re.push(obj);
					}
					callback && callback('OK',re);
				},
				handleError: function(aError) {
					callback && callback(aError.message);
				},
				handleCompletion: function(aReason) {
					callback && callback('Completion');
					if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
						callback && callback('Error');
						console.log("Query canceled or aborted!");
					}
				}
			});
		} else {
			statement.executeAsync();
		}
	},
	exeSQLBatch: function (sql, paramsAry) {
		let statement = this.mDBConn.createStatement(sql);		
		let columns = [], re = [];
		for (let i = 0, len = statement.columnCount; i < len; i++) {
			columns.push(statement.getColumnName(i));
		}
		
		for (let pi = 0, len = paramsAry.length; pi < len; pi++) {
			let params = paramsAry[pi], i;
			for (i in params) {
				statement.params[i] = params[i];
			}	
			try {
				while (statement.executeStep()) {
					let row = statement.row, obj = {};
					for(let i = 0, len = columns.length; i < len; i++) {
						obj[columns[i]] = row[columns[i]];
					}
					re.push(obj);
				}
			} catch (e) {
				throw new Error(pi + ':' + e.message);
			} finally {
				statement.reset(); 
			}
		}
		statement.finalize();
		return re;
	},
	exeSQLBatchAsync: function (sql, paramsAry ,callback)  {
		let statement = this.mDBConn.createStatement(sql);	
		let columns = [];
		for (let i = 0, len = statement.columnCount; i < len; i++) {
			columns.push(statement.getColumnName(i));
		}
		
		let bindParams = statement.newBindingParamsArray();
		for (let pi = 0, len = paramsAry.length; pi < len; pi++) {
			let bp = bindParams.newBindingParams();
			let params = paramsAry[pi], i;
			for (i in params) {
				bp.bindByName(i, params[i]);
			}
			bindParams.addParams(bp);
		}
		statement.bindParameters(bindParams);
		
		let re = [] ;
		if (!!callback) {
			statement.executeAsync({
				handleResult: function(aResultSet) {
					let re = [] ;
					for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
						let obj = {};
						for(let i = 0, len = columns.length; i < len; i++) {
							obj[columns[i]] = row.getResultByName(columns[i]);
						}
						re.push(obj);
					}
					callback && callback('OK',re);
				},
				handleError: function(aError) {
					callback && callback(aError.message);
				},
				handleCompletion: function(aReason) {
					if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
						console.log("Query canceled or aborted!");
					}
				}
			});
		} else {
			statement.executeAsync();
		}
	}
}