const EXPORTED_SYMBOLS = ['Socket'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/utils/Prefs.js');

const STATUS_CODES = {};
STATUS_CODES[Ci.nsISocketTransport.STATUS_RESOLVING]       =   "resolving";
STATUS_CODES[Ci.nsISocketTransport.STATUS_CONNECTING_TO]   =   "connecting";
STATUS_CODES[Ci.nsISocketTransport.STATUS_CONNECTED_TO]    =   "connected";
STATUS_CODES[Ci.nsISocketTransport.STATUS_SENDING_TO]      =   "sending";
STATUS_CODES[Ci.nsISocketTransport.STATUS_WAITING_FOR]     =   "waiting";
STATUS_CODES[Ci.nsISocketTransport.STATUS_RECEIVING_FROM]  =   "receiving";
STATUS_CODES[Ci.nsITransport.STATUS_READING]               =   "reading";
STATUS_CODES[Ci.nsITransport.STATUS_WRITING]               =   "writing";

function toBinaryInputStream (inputStream) {
	var stream = Components.classes["@mozilla.org/binaryinputstream;1"]
								.createInstance(Components.interfaces.nsIBinaryInputStream);
	stream.setInputStream(inputStream);
	return stream;
}

function toScriptableInputStream (inputStream) {
	var stream = Components.classes["@mozilla.org/scriptableinputstream;1"]
								.createInstance(Components.interfaces.nsIScriptableInputStream);
	stream.init(inputStream);
	return stream;
}

function getProxyInfo() {
	var prefs = new Prefs('network.proxy.');
	if (prefs.get('type') == 1) {
		let proxyHost = prefs.get('socks');
		let proxyPort = prefs.get('socks_port');
		if (proxyHost && proxyPort) {
			let proxyService = Components.classes["@mozilla.org/network/protocol-proxy-service;1"]
								.getService(Components.interfaces.nsIProtocolProxyService);
			return proxyService.newProxyInfo("socks", proxyHost, proxyPort, 0, 30, null);
		}
	}
}

function SocketListener(observer) {
	this.observer = {
		start: function () {},
		stop: function () {}
	}; 
	_extend(this.observer, observer);
}

SocketListener.prototype = {
	onStartRequest: function (channel, socketContext) {
		var socket = socketContext.wrappedJSObject;
		this.observer.start(socket);
	},
	onStopRequest: function (channel, socketContext, status, errorMsg) {
		var socket = socketContext.wrappedJSObject;
		this.observer.stop(socket, status);
		try {
			socket.stream.close();
			socket.inStream.close();
			socket.outStream.close();
		} catch (e) {}
	},
	onDataAvailable: function (channel, socketContext, inputStream, sourceOffset, count) {
		var socket = socketContext.wrappedJSObject;
		socket.inStream = inputStream;
		if (socket.binary) {
			socket.stream = toBinaryInputStream(socket.inStream);
			this.observer.receiveData(socket.stream.readBytes(count), socket);
		} else {
			socket.stream = toScriptableInputStream(socket.inStream);
			this.observer.receiveData(socket.stream.read(count), socket);
		}
	}	
}

/*
	{
		host:
		port:
		types: ["starttls", "ssl","udp"]
		onClose: function () {
		}
	}
*/

function Socket (opts) {
	if (!(this instanceof Socket)) {
		return new Socket(opts);
	} else {
		_extend(this, {
			types: null,
			binary: true
		}, opts);
	}
}

Socket.prototype = {
	async: function (observer) {
		this.wrappedJSObject = this;
		var pump = Components.classes["@mozilla.org/network/input-stream-pump;1"]
							 .createInstance(Components.interfaces.nsIInputStreamPump);
		pump.init(this.inStream, -1, -1, 0, 0, true);
		pump.asyncRead(new SocketListener(observer), this);
		return this;
	},
	isOpen: function () {
		return this.isOpenFlag; 
	},
    available: function () {
		if (!this.isAlive()) {
			return 0;
		}
		var bytesAvailable = 0;
		try {
			bytesAvailable = this.stream.available();
		} catch(exception) {
			this.isConnected = false;
			this._exception = exception;
		}
		return bytesAvailable;
	},
	close: function () {
		if (!this.isOpen()) {
			return;
		}
		this.isOpenFlag = false;
		this.isConnected = false;
		this.socketTransport.close(0);
		return this;
	},
	isAlive: function () {
		this.isConnected = ( this.isOpen() ? this.socketTransport.isAlive() : false );
		return this.isConnected;
	},
	open: function () {
		if (this.isOpen()) {
			return;
		}
		
		var transportService = Components.classes["@mozilla.org/network/socket-transport-service;1"]
									 .getService(Components.interfaces.nsISocketTransportService);
		var socketTransport = transportService.createTransport(
			this.types,
			(this.types == null  ? 0 : this.types.length),
			this.host,
			this.port,
			getProxyInfo()
		);
		
		
		var self = this;
		socketTransport.setEventSink({
			onTransportStatus: function( transport, status, progress, progressMax ){
				switch( STATUS_CODES[ status ] ){
					case "connected":
						self.isConnected = true;
					break;
				}
			}
		}, Services.tm.currentThread);
		
		this.socketTransport = socketTransport;
		if (!this.socketTransport) {
			throw ("Socket.open: Error opening transport.");
		}
		this.isOpenFlag = true;
		this._openStreams();
		return this;
	},
	_openStreams: function () {
		var socketTransport = this.socketTransport;
		this.outStream = socketTransport.openOutputStream(0, 0, 0);
		this.inStream = socketTransport.openInputStream(0, 0, 0);
		
		var stream;
		if (this.binary == true) {
			this.stream = toBinaryInputStream(this.inStream);
		} else {
			this.stream = toScriptableInputStream(this.inStream);
		}
		return this;
	},
	read: function () {
		if (!this.isAlive()) {
			throw "Socket.read: Not Connected.";
		}
		var availableBytes = this.available();
		if (availableBytes == 0) {
			return '';
		}
		if (this.binary) {
			return this.stream.readBytes(availableBytes);
		} else {
			return this.stream.read(availableBytes);
		}
	},
	write: function (str) {
		if (!this.isAlive()) {
			throw "Socket.write: Not Connected.";
		}
		try {
			return this.outStream.write(str, str.length);
		} catch (e) { 
			this.isConnected = false;
			return 0;
		}
	}
}

/*
this.execute = function(command) {
listener.command = command;
if (command.request) {
  var request = command.request;

function write() {
this.workerThread = Components.classes["@mozilla.org/thread-manager;1"]
							.getService(Components.interfaces.nsIThreadManager)
							.currentThread;
	try {
	  var count = outStream.write(request, request.length);
	  if (count < request.length) {
		request = request.substr(count);
		outStream.QueryInterface(Components.interfaces.nsIAsyncOutputStream);
		outStream.asyncWait({ onOutputStreamReady: function() {
								write();
							  }}, 0, 0, this.workerThread); 
	  }
	  else outStream.write("\r\n", 2);
	}
	catch(e) { self.error("connectionFailed"); }
  }
  write();      
}
}
*/