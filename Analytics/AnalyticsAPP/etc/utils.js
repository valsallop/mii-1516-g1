
module.exports = {
	//	It converts string that represent an ISO Date to an Date object
	parseISODate: function(isoDateString) {
		var localDate = new Date(isoDateString);
		return new Date( localDate.getTime() + ( localDate.getTimezoneOffset() * 60000 ) );
	},
	//	It converts Date object to a string represents an ISO Date 
	parseDate2ISO: function(localDate) {
		var ISODate = new Date( localDate.getTime() - ( localDate.getTimezoneOffset() * 60000 ) );
		return ISODate.toISOString();
	}
};