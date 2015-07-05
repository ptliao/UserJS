const EXPORTED_SYMBOLS = ['CACHE'];

const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;
const cacheService = Cc["@mozilla.org/network/cache-service;1"].getService(Ci.nsICacheService);

function StreamListener(aFile) {
	this._file = aFile;
	this._data = [];
}

StreamListener.prototype = {
	onStartRequest: function(aRequest, aContext) {},
	onStopRequest: function(aRequest, aContext, aStatusCode) {
		var data = this._data.join("");
		var fileOutputStream = Cc["@mozilla.org/network/file-output-stream;1"]
											.createInstance(Ci.nsIFileOutputStream);
		try {
			fileOutputStream.init(this._file, -1, 0755, 0);
			fileOutputStream.write(data, data.length);
			fileOutputStream.flush();
		} catch(e) {
			this._file.remove(false);
		} finally {
			fileOutputStream.close();
		}
	},
	
	onDataAvailable: function(aRequest, aContext, aInputStream, aOffset, aCount) {
		var binaryInputStream = Cc["@mozilla.org/binaryinputstream;1"]
											.createInstance(Ci.nsIBinaryInputStream);
		binaryInputStream.setInputStream(aInputStream);
		this._data.push(binaryInputStream.readBytes(binaryInputStream.available()));
		binaryInputStream.close();
	}
};


//https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsICacheVisitor
const CACHE = {
	list: function (visit) {
		var _visit = {};
		if (!!visit.visitDevice) {
			_visit.visitDevice = function (aDeviceID, aDeviceInfo) {
				let _aDeviceInfo = {
					description: aDeviceInfo.description,
					entryCount: aDeviceInfo.entryCount,
					maximumSize: aDeviceInfo.maximumSize,
					totalSize: aDeviceInfo.totalSize,
					usageReport: aDeviceInfo.usageReport 
				}; 
				return visit.visitDevice(aDeviceID, _aDeviceInfo)
			}
		};
		if (!!visit.visitEntry) {
			_visit.visitEntry = function (aDeviceID, aEntryInfo) {
				let _aEntryInfo = {
					clientID: aEntryInfo.clientID,
					dataSize: aEntryInfo.dataSize,
					deviceID: aEntryInfo.deviceID,
					expirationTime: aEntryInfo.expirationTime,
					fetchCount: aEntryInfo.fetchCount,
					key: aEntryInfo.key,
					lastFetched: aEntryInfo.lastFetched,
					lastModified: aEntryInfo.lastModified,
					isStreamBased: aEntryInfo.isStreamBased()
				};
				return visit.visitEntry(aDeviceID, _aEntryInfo)
			}
		};
		cacheService.visitEntries(_visit);
	},
	get: function (clientID, key) {
		let session = cacheService.createSession(clientID, Ci.nsICache.STORE_ANYWHERE, true);
		//session.doomEntriesIfExpired = false;
		let descriptor = session.openCacheEntry(key, Ci.nsICache.ACCESS_READ, false);
		return {
			visitMeta: function (visitor) {
				descriptor.visitMetaData({
					visitMetaDataElement: function (aKey, aValue) {
						return visitor(aKey, aValue);
					}
				});
			},
			getMeta: function (key) {
				try {
					return descriptor.getMetaDataElement(key);
				} catch (e) {
					return null;
				}
			},
			setMeta: function (key, value) {
				return descriptor.setMetaDataElement(key, value);
			},
			setSize: function (size) {
				return descriptor.setSize(size);
			},
			setExpiration: function (expirationTime) {
				return descriptor.setExpirationTime(expirationTime);
			},
			save: function (path) {
				var folder = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
				folder.initWithPath(path);
				var file = folder.clone();
				file.createUnique(Ci.nsILocalFile.NORMAL_FILE_TYPE, 0755);
				var encode = descriptor.getMetaDataElement('content-encoding');
				var inputStream = descriptor.openInputStream(0);
				if (encode) {
					var converterService = Cc["@mozilla.org/streamConverters;1"]
									.getService(Ci.nsIStreamConverterService);
					var converter = converterService.asyncConvertData(encode, "uncompressed", new StreamListener(file), null);
					converter.onStartRequest(null, null);
					converter.onDataAvailable(null, null, inputStream, 0, inputStream.available());
					converter.onStopRequest(null, null, null);
				} else {
					var fileOutputStream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
					var binaryInputStream = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
					binaryInputStream.setInputStream(inputStream);
					var content = binaryInputStream.readBytes(binaryInputStream.available());
					fileOutputStream.init(file, -1, 0666, 0);
					fileOutputStream.write(content, content.length);
					fileOutputStream.flush();
					binaryInputStream.close();
					fileOutputStream.close();
				}
			}

		}
	}
}