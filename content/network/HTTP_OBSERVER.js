const EXPORTED_SYMBOLS = ['HTTP_OBSERVER'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/UTIL.js');

function TracingListener () {
    this.originalListener = null;
    //this.receivedData = [];   
}

TracingListener.prototype = {
    onDataAvailable: function (request, context, inputStream, offset, count) {
		let binaryInputStream =Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
		let storageStream =Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
		let binaryOutputStream =Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
	
        binaryInputStream.setInputStream(inputStream);
        storageStream.init(8192, count, null);
        binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));

        // Copy received data as they come.
        let data = binaryInputStream.readBytes(count);
        //this.receivedData.push(data);

        binaryOutputStream.writeBytes(data, count);

        this.originalListener.onDataAvailable(request, context,
            storageStream.newInputStream(0), offset, count);
    },
    onStartRequest: function (request, context) {
        this.originalListener.onStartRequest(request, context);
    },
    onStopRequest: function (request, context, statusCode){
        //var responseSource = this.receivedData.join();
        this.originalListener.onStopRequest(request, context, statusCode);
    },
    QueryInterface: function (aIID) {
        if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports)) {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    }
}

function masonRedirect (subject, newURL) {
	var newListener = new TracingListener();
	aSubject.QueryInterface(Ci.nsITraceableChannel);
	newListener.originalListener = aSubject.setNewListener(newListener);
}

const HTTP_OBSERVER={
	init: false,
	maxWeight: 0,
	config: {
		'request': {'list': []},
		'response': {'list': []}
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
	},
	del: function (req, url) {
		delete this.config[req][url];
		let list = this.config[req]['list'];
		let index = list.indexOf(url);
		if (index != -1) {
			list.splice(index, 1);
		}
	},
	clear: function (req) {
		req = req || '';
		if (!!req) {
			delete this.config[req];
			this.config[req] = {'list': []};
		} else {
			delete this.config;
			this.config = {
				'request': {'list': []},
				'response': {'list': []}
			};
		}
	}
}


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
							/*if(typeof method[key]=="function"){
								method[key](subject.getRequestHeader(key));
							}else{*/
							if (key.toLowerCase() == 'wgu:stop') {
								
							} else {
								try {
									subject.setRequestHeader(key, subject.getRequestHeader(method[key]), false);
									subject.setRequestHeader(method[key], null, false);
								} catch (e) {
									subject.setRequestHeader(key, method[key], false);
								}
							}
						}
					}
				}
			}
			break; 
		case 'http-on-examine-cached-response':
		case 'http-on-examine-response':
			subject.QueryInterface(Ci.nsIHttpChannel);
			list = config.response.list;			
			for (let i = 0, len = list.length; i < len; i++) {
				let url = list[i], tmp = config.response[url];
				if ( url == subject.URI.asciiSpec || tmp['reg'].test(subject.URI.asciiSpec)) {
					if (tmp.method) {
						let method = tmp.method;
						for (var key in method) {
							/*if(typeof method[key]=="function"){
								method[key](subject.getResponseHeader(key));
							}else{*/
							if (key.toLowerCase() == 'wgu:location') {
								setTimeout(masonRedirect, 0, subject, method[key]);
							} else {							
								if (method[key].substr(0, 2) == "H-") {
									try {
										subject.setResponseHeader(key,subject.getResponseHeader(method[key]), false);
										subject.setResponseHeader(method[key], null, false);
									} catch (e) { }
								} else {
									subject.setResponseHeader(key, method[key], false);
								}			
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

if (HTTP_OBSERVER.init == false) {
	HTTP_OBSERVER.register();
}