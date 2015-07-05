const EXPORTED_SYMBOLS = ['ServerSocket'];

Components.utils.import('chrome://UserJS/content/require.js');
Components.utils.import('chrome://UserJS/content/network/Socket.js');

/*  
{receiveData: function (date) {
	console.log(date);
	if (date == 'bye') {
		socket.wite('bye');
		socket.close();
	}
}}
*/

function ServerSocketListener(observer) {
	this.observer = observer; 
	
}

ServerSocketListener.prototype = {
	onSocketAccepted: function (serverSocket, socketTransport) {
		console.log('onSocketAccepted');
		var socket = new Socket({
			socketTransport: socketTransport,
			isOpenFlag: true
		})._openStreams().async(this.observer);
	},
	onStopListening: function (channel, socketContext, status, errorMsg) {
		console.log("onStopListening");
	}
}


function ServerSocket (port, listener) {
	if (!(this instanceof ServerSocket)) {
		return new ServerSocket(port, listener);
	} else {
		var serverSocket = Cc["@mozilla.org/network/server-socket;1"]
                             .createInstance(Ci.nsIServerSocket);
		serverSocket.init(port, false, -1);
		serverSocket.asyncListen(new ServerSocketListener(listener));
		this.serverSocket = serverSocket;
	}
}

ServerSocket.prototype = {
	close: function () {
		this.serverSocket.close();
	}
}
