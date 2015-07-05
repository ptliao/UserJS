const EXPORTED_SYMBOLS = ['dateFormat'];

const DEFAULT_DATE_FORMAT = "d.m.Y - H:i:s";

const MONTH = ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"];
const WEEK_DAY = ["Sunday", "Monday", "Tuesday", "Wedensday", "Thursday", "Friday", "Saturday"];

  
  /**
   * Returns a string formatted according to the given 
   * format string using the given date object
   */
const DATE_PATTERN = {
	'a': function (aDate) {
		return getMeridiem(getHours(aDate));
	},
	'A': function (aDate) {
		return getMeridiem(getHours(aDate)).toUpperCase();
	},
	'B': function (aDate) {
		return getSwatchInternetTime(aDate);
	},
	'd': function (aDate) {
		return insertLeadingZero(aDate.getDate());
	},
	'D': function (aDate) {
		return WEEK_DAY[aDate.getDay()].substr(0,3);
	},
	'F': function (aDate) {
		return MONTH[aDate.getMonth()];
	},
	'g': function (aDate) {
		return twelveHour(aDate);
	},
	'G': function (aDate) {
		return getHours(aDate);
	},
	'h': function (aDate) {
		return insertLeadingZero(twelveHour(aDate));
	},
	'H': function (aDate) {
		return insertLeadingZero(getHours(aDate));
	},
	'i': function (aDate) {
		return insertLeadingZero(aDate.getMinutes());
	},
	'I': function (aDate) {
		return "";
	},
	'j': function (aDate) {
		return aDate.getDate();
	},
	'l': function (aDate) {
		return WEEK_DAY[aDate.getDay()];
	},
	'L': function (aDate) {	
		return leapYear(aDate.getFullYear());
	},
	'm': function (aDate) {	
		return insertLeadingZero(aDate.getMonth()+1);
	},
	'M': function (aDate) {	
		return MONTH[aDate.getMonth()].substr(0,3);
	},
	'n': function (aDate) {	
		return aDate.getMonth()+1;
	},
	'O': function (aDate) {	
		return getGTMDifference(aDate);
	},
	'r': function (aDate) {	
		return getRFCDate(aDate);
	},
	's': function (aDate) {	
		return insertLeadingZero(aDate.getSeconds());
	},
	'S': function (aDate) {	
		return getDateSuffix(aDate.getDate());
	},
	't': function (aDate) {	
		return getDaysInMonth(aDate);
	},
	'T': function (aDate) {	
		return "";
	},
	'U': function (aDate) {	
		return aDate.getTime();
	},
	'w': function (aDate) {	
		return aDate.getDay();
	},
	'W': function (aDate) {	
		return getWeekNumber(aDate);
	},
	'y': function (aDate) {	
		return (""+aDate.getFullYear()).substr(2,2);
	},
	'Y': function (aDate) {	
		return aDate.getFullYear();
	},
	'z': function (aDate) {	
		return getNumberOfDays(aDate);
	},
	'Z': function (aDate) {	
		return getTimezoneOffset(aDate);
	}
}

function dateFormat(aDateString, aDate) {
	aDateString = aDateString || DEFAULT_DATE_FORMAT;
	aDate = aDate || new Date;
	return aDateString.replace(/\b[A-Za-z]\b/g,function (a){
		return DATE_PATTERN[a](aDate)
	})
}
  

/**
* Returns the hour in a 12-hour format
*/
function twelveHour(aDate) {
	aDate = aDate || new Date;
	let hour = aDate.getHours();
	if (getMeridiem(hour) == "pm") {
		hour -= 12;
	}
	if (hour == 0) {
		hour = 12;
	}
	return hour;
}
  
  
/**
* Returns lowercase am or pm based on the given 24-hour
*/
function getMeridiem(hour) {
	if ( hour>11 ) {
		return "pm";
	} else {
		return "am";
	}
}
  
  
/**
* Return true if year is a leap year otherwise false
*/
function leapYear(year) {
	//The Date object automatic corrigates if values is out of limit
	//29 isn't out of limit if it is leap year!
	if (new Date(year, 1, 29).getMonth() == 1) {
		return 1;
	} else {
		return 0;
	}
}

  
/**
* Returns the number of days from new year to current date (incl current day)
*/
function getNumberOfDays(date) {
	let currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	let startOfYear = new Date(date.getFullYear(), 0, 1);
	return (currentDate.getTime() - startOfYear.getTime())/86400000 +1;
}
  
  
/**
* Returns the number of days in the current month of the date object
*/
function getDaysInMonth(date) {
	let currentDate = new Date(date.getFullYear(), date.getMonth()+1, 0);
	let startOfYear = new Date(date.getFullYear(), date.getMonth(), 1);
	return ( currentDate.getTime() - startOfYear.getTime() )/86400000 +1;
}


/**
* Returns the english ordinal suffix for the day of the month, 2 characters
*/
function getDateSuffix(dayOfMonth) {
	if (dayOfMonth > 3 && dayOfMonth < 21) {
		return "th";
	} else {
		return ["st","nd","rd"][dayOfMonth%10 - 1] || "th";
	}
}


function daylightSavingsTime(date) {
	return 0;
}

/**
* Timezone offset in seconds
* -43200 through 43200
*/
function getTimezoneOffset(date) {
	return date.getTimezoneOffset()*(-60);
}


/**
* This function isn't implemented yet, but here is an idea of how it might look
* Before thins function can be made the function daylightSavingsTime() have 
* to be written
* http://www.timeanddate.com/time/abbreviations.html
* http://setiathome.ssl.berkeley.edu/utc.html
*/
function getTimezone(date) {
	let map = {};
	if ( daylightSavingsTime(date)==1 ) {
		map = {"1": "WEST", "2": "CEST", "3": "EEST"};[''+getTimezoneOffset(date)/3600];
	} else {
		map = {"1": "WET", "2": "CET", "3": "EET"};
	}
	return map[''+getTimezoneOffset(date)/3600] || "";
}


/**
* Difference to Greenwich time (GMT) in hours
*/
function getGTMDifference(date) {
	let offset = getTimezoneOffset(date)/3600;
	if (offset>0) {//adding leading zeros and gives the offset a positive prefix
	  return "+" + insertLeadingZero(offset) + "00";
	} else { //if negative, make the offset positive before adding leading zeros and give the number a negative prefix
	  return "-" + insertLeadingZero(offset*(-1)) + "00";
	}
}
  

/**
* In [ISO8601], the week number is defined by:
* - weeks start on a monday
* - week 1 of a given year is the one that includes the first 
*   Thursday of that year.
*   (or, equivalently, week 1 is the week that includes 4 January.)
* Weeknumbers can be a number between 1 - 53 (53 is not common)
*/
function getWeekNumber(date) {
	let weekday = date.getDay();
	if (weekday == 0) {
		weekday = 7;
	}

	//currentDate is on the fist monday in the same week of date (could be the same date)
	let currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-(weekday-1));
	let startOfYear = new Date(currentDate.getFullYear(), 0, 1);

	let firstWeekday = startOfYear.getDay();

	let extraDays;
	if ( 5 > firstWeekday ) {
		extraDays = firstWeekday - 1;
	} else {
		extraDays = firstWeekday - 8;
	}

	//var numberOfDays = ( ( currentDate.getTime()-startOfYear.getTime() )/86400000 ) + extraDays;
	//var weekNumber = numberOfDays/7 +1; 

	return (( (currentDate.getTime() - startOfYear.getTime())/86400000 ) + extraDays)/7 +1;
}


/**
* RFC 822 formatted
* http://www.freesoft.org/CIE/RFC/822/39.htm
*/
function getRFCDate(aDate) {
	let dayRFC  = WEEK_DAY[aDate.getDay()].substr(0,3);
	let dateRFC = aDate.getDate() + " " + MONTH[aDate.getMonth()].substr(0,3) 
				+ " " + ("" + aDate.getFullYear()).substr(2,2);
	let timeRFC = insertLeadingZero(aDate.getHours()) + ":" 
				+ insertLeadingZero(aDate.getMinutes()) + ":" 
				+ insertLeadingZero(aDate.getSeconds()) + " " + getGTMDifference(aDate);
	return dayRFC + ", " + dateRFC + " " + timeRFC;
}  
  

/**
* 1min 26.4sek = 1 Swatch beat
* (60sek + 26.4sek)*1000milliseconds/second = 86400miliseconds = 1 Swatch beat
*/
function getSwatchInternetTime(aDate) {
// A day in Internet Time begins at midnight BMT (@000 Swatch Beats) 
// (Central European Wintertime) (+0100 from GTM)
// This line makes the Date object corrigate if the hour is 23 then it 
// will be set to 0 and the date will be incremented

	let nDate = new Date(aDate); 
	nDate.setUTCHours(aDate.getUTCHours() + 1);

	let milliseconds = Date.UTC(1970, 0, 1, 
								nDate.getUTCHours(), 
								nDate.getUTCMinutes(), 
								nDate.getUTCSeconds());

	return "@" + ( milliseconds - ( milliseconds%86400 ) )/86400;
}


/**
* Some of the numbers needs leading zeros
* and this function returns the number with a leading zero
* if the number is smaller than 10
*/
function insertLeadingZero(number) {
	if (number < 10) {
		number = "0" + number;
	}
	return number;
}


/**
* This function is used to make every second character a backslash
* so the insterted charaters isn't converted to hours, dates and so on.
*/
function addSlashes(string) {
	return string.split('').join('\\');
}
  
function getHours (aDate) {
	return (aDate || new Date()).getHours();
}
