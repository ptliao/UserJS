const EXPORTED_SYMBOLS = ['FILE_BASE'];

Components.utils.import('chrome://UserJS/content/require.js');



const FILE_BASE = {
	separator: ({"WINNT": "\\", "Linux": "/"}[Services.appinfo.os] || "")
}
