
var mongoose = require('mongoose');

var Schema = mongoose.Schema;  

var tweetSchema = new Schema({
  code_product: {
    type: Number,
    label: "code_product"
  },
  tweet: {
    type: String,
    label: "tweet",
    max: 500
  },
  ts_value: {
   type: Date,
   default: Date.now
  },
  lang:{
	  type: String,
	  default: "EN"
  },
  message:{
	  type:String
  }
});

var TweetModel = mongoose.model('tweets', tweetSchema);

module.exports = TweetModel;