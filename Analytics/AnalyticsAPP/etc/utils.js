
module.exports = {
  parseISODate: function(isoDateString) {
    var localDate = new Date(isoDateString);
    return new Date( localDate.getTime() + ( localDate.getTimezoneOffset() * 60000 ) );
  },
       
  parseDate2ISO: function(localDate) {
    var ISODate = new Date( localDate.getTime() - ( localDate.getTimezoneOffset() * 60000 ) );
    return ISODate.toISOString();
  }
};