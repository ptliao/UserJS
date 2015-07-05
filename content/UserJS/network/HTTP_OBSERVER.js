const EXPORTED_SYMBOLS = ['HTTP_OBSERVER'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/UTIL.js');
Components.utils.import('chrome://UserJS/content/utils/_TIMER.js');
Components.utils.import('chrome://UserJS/content/utils/PATH_MANAGE.js');
Components.utils.import('chrome://UserJS/content/datebase/DateBase.js');
Components.utils.import('chrome://UserJS/content/UserJS/network/COOKIE_MANAGE.js');
Components.utils.import('resource://gre/modules/NetUtil.jsm');


//LiveHTTPHeaders.js
const JS_ScriptableInputStream = new CC("@mozilla.org/scriptableinputstream;1", "nsIScriptableInputStream" );

//getPostData
function postData(stream) {
	this.seekablestream = stream;
	this.stream = new JS_ScriptableInputStream();
	this.stream.init(this.seekablestream);
	this.mode = this.FAST;
	try { 
		this.seekablestream.QueryInterface(Ci.nsIMIMEInputStream);
		this.hasheaders = true;
		this.body = -1;
	} catch (ex) {
		this.hasheaders = false;
		this.body = 0; 
	}
}

postData.prototype = {
	NONE: 0,
	FAST: 1,
	SLOW: 2,
	rewind: function() {
		this.seekablestream.seek(0,0);
	},
	tell: function() {
		return this.seekablestream.tell();
	},
	readLine: function() {
		var line = "";
		var size = 0;
		try { size = this.stream.available(); } catch (ex) { size = 0; }
		for (var i=0; i<size; i++) {
			var c = this.stream.read(1);
			if (c == '\r') {
			} else if (c == '\n') {
				break;
			} else {
				line += c;
			}
		}
		return line;
	},
	setMode: function(mode) {
		if (mode < this.NONE && mode > this.SLOW) {
			throw "postData: unsupported mode: " + this.mode;
		}
		this.mode = mode;
	},
	visitPostHeaders: function(visitor) {
		this.rewind();
		if (!this.hasheaders) { return; }
		var line = this.readLine();
		while(line) {
			if (visitor) {
				var tmp = line.split(/:\s?/);
				visitor.visitHeader(tmp[0],tmp[1]);
			}
			line = this.readLine();
		}
		this.body = this.tell();
	},
	getPostBody: function(max) {
		if (this.body < 0 || this.seekablestream.tell() != this.body) {
			this.visitPostHeaders(null);
		}
		var size = 0;
		try { size = this.stream.available(); } catch(ex) { size = 0; }
		if (max && max >= 0 && max<size) size = max;
		var postString = "";
		try {
			switch (this.mode) {
				case this.NONE:
					break;
				case this.FAST:
					if (size>0) {
						postString = this.stream.read(size);
					}
					break;
				case this.SLOW:
					for (var i=0; i<size; i++) {
						var c=this.stream.read(1);
						c ? postString+=c : postString+='\0';
					}
				break;
			}
		} catch (ex) {
			return ""+ex;
		} finally {
			try { this.stream.read(this.stream.available()); } catch (ex) {}
		}
		return postString;
	}
};

function getPostData(oHttp) { 
	try {
		oHttp.QueryInterface(Ci.nsIUploadChannel);
		if (oHttp.uploadStream) {
			oHttp.uploadStream.QueryInterface(Ci.nsISeekableStream);
			var postObj = new postData(oHttp.uploadStream);;
			postObj.setMode(1);
			return postObj.getPostBody(-1);
		} 
	} catch (e) {
		
	}
	return '';
};



function readURI (uri) {
	let ioservice = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	let channel = ioservice.newChannel(uri, "UTF-8", null);
	let stream = channel.open();

	let cstream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream);  
	cstream.init(stream, "UTF-8", 0, 0);

	let str = {}, data = "", read = 0;
	do {
		read = cstream.readString(0xffffffff, str);
		data += str.value;
	} while (read != 0);
	cstream.close();

	return data;
}


function MasonDummyStreamListener () {
	this.originalListener = null;
	this.originalChannel = null;
	this.newChannel = null;
};
MasonDummyStreamListener.prototype = {
	onDataAvailable: function(request, context, inputStream, offset, count) {},
	onStartRequest: function(request, context) {},
	onStopRequest: function(request, context, statusCode) {
		try{
			this.newChannel.asyncOpen(new MasonWrappedChannel(this.originalListener, this.originalChannel), context);
		} catch (e) {
			this.originalListener.onStartRequest(request, context);
			this.originalListener.onStopRequest(request, context, statusCode);
			this.newChannel = null;
		}
	},
	QueryInterface: function (aIID) {
		if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports)) {
			return this;
		} else {
			throw Components.results.NS_NOINTERFACE;
		}
	}
};
	
function MasonWrappedChannel(oListener, oChannel) {
	this.mListener = oListener;
	this.mChannel = oChannel;
}
MasonWrappedChannel.prototype = {
	onDataAvailable: function(request, context, inputStream, offset, count) {
		/*
		let binaryInputStream = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
		let storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
		let binaryOutputStream = Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
		
		
		binaryInputStream.setInputStream(inputStream);
		storageStream.init(8192, count, null);
		binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
		
		// Copy received data as they come.
		let data = binaryInputStream.readBytes(count);
		//this.receivedData.push(data);
		//log("data magic:" + data);
		//data=data.replace('function','funcgion');
		binaryOutputStream.writeBytes(data,count);
	  */
		this.mListener.onDataAvailable(request, context,  inputStream, offset, count);
	},
	onStartRequest: function(request, context) {
		this.mListener.onStartRequest(request, context);
	},
	onStopRequest: function(request, context, statusCode) {
		this.mRequest = request;
		this.mListener.onStopRequest(request, context, statusCode);
		this.mListener.onStopRequest(this, context, statusCode);
	},
  
	get baseChannel(){
		return this.mChannel;
	},
	get contentDisposition(){return "true";},
	get isLastPart(){return true;},
	get partID(){return 1;},
  
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
			return this;
		}else{
			try{
				var result = this.mRequest.QueryInterface(aIID);
				return result;
			}catch(e){
				throw Components.results.NS_NOINTERFACE;
			}
		}
	}
};

function masonRedirect(subject,newURL){
	subject.suspend();
	
	let newChannel = Services.io.newChannel(newURL, null, null);				
	let newListener = new MasonDummyStreamListener();
	subject.QueryInterface(Ci.nsITraceableChannel);
	newListener.originalListener = subject.setNewListener(newListener);
	newListener.originalChannel = subject;
	newChannel.owner = subject.owner;
	subject.owner = subject.notificationCallbacks = newChannel.notificationCallbacks = null;
	newListener.newChannel = newChannel;
	
	subject.resume();
	subject.cancel(Cr.NS_NOINTERFACE);	
}




function TracingListener (newURL) {
    this.originalListener = null;
	this.newURL = newURL;
	this.isNeedData = false;
	if (this.newURL.indexOf('(function') == 0) {
		this.isNeedData = true;
		this.receivedData = [];
	}
}

TracingListener.prototype = {
    onDataAvailable: function (request, context, inputStream, offset, count) {	
		//
		let binaryInputStream = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);	
		binaryInputStream.setInputStream(inputStream);
		let data = binaryInputStream.readBytes(count);	
		if (this.isNeedData == true) {
			this.receivedData.push(data);
		}
    },
    onStartRequest: function (request, context) {
		this.originalListener.onStartRequest(request, context);
    },
    onStopRequest: function (request, context, statusCode){
		let date, count;
		if (this.isNeedData == true) {
			let fn = eval(this.newURL);
			date = fn(this.receivedData.join('')), count = date.length;
			this.receivedData = null;
		} else {
			let self = this;
			NetUtil.asyncFetch(NetUtil.newChannel(this.newURL), function (aStream, aStatus) {
				if (!Components.isSuccessCode(aStatus)) {
					return;
				}

				self.originalListener.onDataAvailable(request, context, aStream, 0, aStream.available());			
				self.originalListener.onStopRequest(request, context, aStatus);
				aStream.close();
			});
			return;
			//date = readURI(this.newURL), count = date.length;
		}
		

		let storageStream =Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
		storageStream.init(8192, count, null);
		
		/* jsBetiful
		let outputStream = storageStream.getOutputStream(0);
		outputStream.write(date, count);
		outputStream.close();
		*/
	
		let binaryOutputStream =Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
		binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
		binaryOutputStream.writeBytes(date, count);
		
		this.originalListener.onDataAvailable(request, context, storageStream.newInputStream(0), 0, count);	
		this.originalListener.onStopRequest(request, context, statusCode);
    },
    QueryInterface: function (aIID) {
        if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports)) {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    }
}

function masonModify (subject, newURL) {
	//subject.suspend();
	subject.QueryInterface(Ci.nsITraceableChannel);
	var newListener = new TracingListener(newURL);
	newListener.originalListener = subject.setNewListener(newListener);
	//subject.resume();	
};


const HTTP_OBSERVER={
	init: false,
	maxWeight: 0,
	config: {
		request: {list: []},
		response: {list: []}
	},
	register: function() {
		Services.obs.addObserver(this, 'http-on-modify-request', false);
		Services.obs.addObserver(this, 'http-on-examine-response', false);
		Services.obs.addObserver(this, 'http-on-examine-cached-response', false);
	},
	unregister: function() {
		Services.obs.removeObserver(this, 'http-on-modify-request');
		Services.obs.removeObserver(this, 'http-on-examine-response');
		Services.obs.removeObserver(this, 'http-on-examine-cached-response');
	},
	add: function (req, url, key, val, weight) {
		weight = weight || 0;
		if (weight > this.maxWeight) {
			this.maxWeight = weight;
		}
		
		let config = this.config[req];
		config[url] = config[url] || {};
		config[url]['reg'] = UTIL.parseRegExp(url);
		config[url]['weight'] = weight;
		config[url]['method'] = config[url]['method']||{};
		config[url]['method'][key] = val;
		
		let index = config['list'].indexOf(url);
		if (index != -1) {
			config['list'].splice(index, 1);
		}
		for (var i = 0, len = config['list'].length; i < len; i++) {
			if (config[config['list'][i]].weight > weight){
				break;
			}
		}
		config['list'].splice(i, 0, url);
		return this;
	},
	del: function (req, url) {
		delete this.config[req][url];
		let list = this.config[req]['list'];
		let index = list.indexOf(url);
		if (index != -1) {
			list.splice(index, 1);
		}
		return this;
	},
	clear: function (req) {
		req = req || '';
		if (!!req) {
			delete this.config[req];
			this.config[req] = {list: []};
		} else {
			delete this.config;
			this.config = {
				request: {list: []},
				response: {list: []}
			};
		}
		return this;
	}
}

var _REG = /^wgu([G|L|S])-?(.*)/;
function HeadVisitor(subject) {
	this.subject = subject;
	this.ary = [];
};
HeadVisitor.prototype.visitHeader = function (header, value) {
	var r = header.match(_REG), subject = this.subject, method, key;
	if (!!r) {
		this.ary.push(header);
		method = r[1], key = r[2];
		if (header == 'wguS') {
			subject.cancel(Cr.NS_NOINTERFACE);
		} else if (method == 'S') {
			subject.setRequestHeader(key, value, false);
		}
	}
};

HTTP_OBSERVER['observe'] = function(subject, topic, data) {
	let config = HTTP_OBSERVER.config;
	let list;
	switch (topic) {
		case 'http-on-modify-request' :
			subject.QueryInterface(Ci.nsIHttpChannel);
			list = config.request.list;
			for (let i = 0, len = list.length; i < len; i++) {
				let url = list[i], tmp = config.request[url];
				if ( url == subject.URI.asciiSpec || tmp['reg'].test(subject.URI.asciiSpec)) {
					if (tmp.method) {
						let method = tmp.method;
						for (var key in method) {
							if (key == 'wguS') {
								subject.cancel(Cr.NS_NOINTERFACE);
								return;
							} else if (key == 'wguJOB'){
								jobGetImg(subject.URI.asciiSpec, subject)
							} else if (key == 'wguS-x-forward-for'){
								try {
									subject.getRequestHeader('x-forward-for');
								} catch (e) { 
									subject.setRequestHeader('x-forward-for', method[key], false);
								}
							}else if (key.substr(0, 5) == "wguS-"){
								subject.setRequestHeader(key.substr(5), method[key], false);
							}
						}
					}
				}
			}
			
			let headV = new HeadVisitor(subject);
			subject.visitRequestHeaders(headV);
			list = headV.ary;
			for (let i = 0, len = list.length; i < len; i++) {
				subject.setRequestHeader(list[i], null, false);
			}
			
			try {
				var getStr = subject.getRequestHeader('wguD-header');
				list = getStr.split(',');
				for (let i = 0, len = list.length; i < len; i++) {
					subject.setRequestHeader(list[i], null, false);
				}
			} catch (e) { }			
			break; 
		case 'http-on-examine-cached-response':
		case 'http-on-examine-response':
			subject.QueryInterface(Ci.nsIHttpChannel);
			
			try {
				let getStr = subject.getRequestHeader('wgu-Response');
				if (!!getStr) {
					let ary = getStr.split(','),len = ary.length, i=0, head = '';
					for (i = 0; i < len; i++) {
						head = ary[i];
						try {
							subject.setResponseHeader("wguG-"+head, subject.getResponseHeader(head), false);
							subject.setResponseHeader(head, null, false);
						} catch (e) { }
					}
				}
			} catch (e) { }
			
			list = config.response.list;			
			for (let i = 0, len = list.length; i < len; i++) {
				let url = list[i], tmp = config.response[url];
				if ( url == subject.URI.asciiSpec || tmp['reg'].test(subject.URI.asciiSpec)) {
					if (tmp.method) {
						let method = tmp.method;
						for (var key in method) {
							
							if (key == 'wguL') {
								let newURL = PATH_MANAGE.getFull(method[key]);
								masonModify(subject, newURL);
							} else if (key == 'wguL2') {
								//相当于redriect wguL对于js的情况，浏览器不识别，原因不详
								let newURL = PATH_MANAGE.getFull(method[key]);
								masonRedirect(subject, newURL);
							//} else if (key == "wguXQ") {
								//xqDtToDB(subject);
							} else if (key.substr(0, 5) == "wguG-") {
								let head = key.substr(5);
								try {
									subject.setResponseHeader(key, subject.getResponseHeader(head), false);
									subject.setResponseHeader(head, null, false);
								} catch (e) { }
							} else if (key.substr(0, 5) == "wguS-"){
								let head = key.substr(5);
								subject.setResponseHeader(head, method[key], false);
							}
						}
					}
				}
			}
			break; 
		default :
			break;
	}
};

function jobGetImg(url, subject) {
	var search = url.split('?');
	search.shift();
	search = search.join('?')
	var re = {};
	if(search == "" || typeof search == "undefined") {
		re = {};
	} else {
		search = search.split('&');
		for(var i = 0, len = search.length; i < len; i++) {
			var tmp = search[i].split('=');
			if(i == 0 && tmp.length == 1) {//?132141
				re = {
					'__search__' : tmp[0]
				};
				break;
			}
			re[tmp.shift()] = tmp.join('=');
		}
	}
	
	if (!!re.appKey && !!re.userId) {
		subject.setRequestHeader('Cookie',COOKIE_MANAGE.getCookie(re.appKey, re.userId, url),false);
	}
}

if (HTTP_OBSERVER.init == false) {
	HTTP_OBSERVER.register();
}




/*
var db, tmp = [];
function strToObj (str) {
	var obj = {};
	str.split('&').forEach(function (v) {
		var tmp = v.split('=');
		obj[tmp.shift()] = tmp.join('=');
	});
	return obj;
};
function xqDtToDB (subject) {
	//console.log('xqDtToDB');
	if (!db) {
		db = DateBase('USL://datebase/xqdtnew.sqlite').open();
	}
	if (subject.URI.asciiSpec.indexOf('frontSurvey/answer_control.jsp')!=-1) {
		var body = getPostData(subject);
		if (body.indexOf('question_no=1&') != -1 ) {
			//console.log('wguXQget');
			tmp = [];
		}
		if (body.indexOf('nextQuestionId') != -1 || body.indexOf('submitQuestion') != -1 ) {
			var obj = strToObj(body);
			if (!!obj.subjectId && !!obj.questionIds) {
				//console.log('wguXQnext');
				tmp.push({subjectId:obj.subjectId, questionId:obj.questionIds, dec:body});
			}
			
		}
		if (body.indexOf('removeSession') != -1 ) {
			//console.log('wguXQsubmit:'+tmp.length);
			if (tmp.length > 0) {
				db.exeSQLBatchAsync("REPLACE INTO question2 ('subjectId','questionId','dec') VALUES (:subjectId,:questionId,:dec);",tmp);
				tmp = [];
			} 
		}
		//console.log('ending');
	} else if(subject.URI.asciiSpec.indexOf('/frontSurvey/standardTemplated_control.jsp')!=-1) {
		var body = getPostData(subject);
		var obj = strToObj(body);
		if (!!obj.subjectId) {
			db.exeSQLBatchAsync("REPLACE INTO question2 ('subjectId','questionId','dec') VALUES (:subjectId,:questionId,:dec);",[{subjectId:obj.subjectId, questionId:0, dec:body}]);
		}
	}
};

	function MasonDummyStreamListener () {
	this.originalListener = null;
	this.originalChannel = null;
	this.newChannel = null;
	};
	MasonDummyStreamListener.prototype = {
	onDataAvailable: function(request, context, inputStream, offset, count) {},
	onStartRequest: function(request, context) {},
	onStopRequest: function(request, context, statusCode) {
	try{
	this.newChannel.asyncOpen(new MasonWrappedChannel(this.originalListener, this.originalChannel), context);
	} catch (e) {
	this.originalListener.onStartRequest(request, context);
	this.originalListener.onStopRequest(request, context, statusCode);
	this.newChannel = null;
	}
	},
	QueryInterface: function (aIID) {
	if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports)) {
	return this;
} else {
	throw Components.results.NS_NOINTERFACE;
	}
	}
	};
	
	function MasonWrappedChannel(oListener, oChannel) {
	this.mListener = oListener;
	this.mChannel = oChannel;
	}
	MasonWrappedChannel.prototype = {
	onDataAvailable: function(request, context, inputStream, offset, count) {
	/*
	let binaryInputStream = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
	let storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
	let binaryOutputStream = Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
	
	
	binaryInputStream.setInputStream(inputStream);
	storageStream.init(8192, count, null);
	binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
	
	// Copy received data as they come.
	let data = binaryInputStream.readBytes(count);
	//this.receivedData.push(data);
	//log("data magic:" + data);
	//data=data.replace('function','funcgion');
	binaryOutputStream.writeBytes(data,count);
 ** /
		this.mListener.onDataAvailable(request, context,  inputStream, offset, count);
	},
	onStartRequest: function(request, context) {
		this.mListener.onStartRequest(request, context);
	},
	onStopRequest: function(request, context, statusCode) {
		this.mRequest = request;
		this.mListener.onStopRequest(request, context, statusCode);
		this.mListener.onStopRequest(this, context, statusCode);
	},
  
	//nsIMultiPartChannel
	get baseChannel(){
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
			return this;
		}else{
			try{
				var result = this.mRequest.QueryInterface(aIID);
				return result;
			}catch(e){
				throw Components.results.NS_NOINTERFACE;
			}
		}
	}
};

function masonRedirect(subject,newURL){
	subject.suspend();
	
	let newChannel = Services.io.newChannel(newURL, null, null);				
	let newListener = new MasonDummyStreamListener();
	subject.QueryInterface(Ci.nsITraceableChannel);
	newListener.originalListener = subject.setNewListener(newListener);
	newListener.originalChannel = subject;
	newChannel.owner = subject.owner;
	subject.owner = subject.notificationCallbacks = newChannel.notificationCallbacks = null;
	newListener.newChannel = newChannel;
	
	subject.resume();
	subject.cancel(Cr.NS_NOINTERFACE);
		
}

*/