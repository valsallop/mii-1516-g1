
var mongoose = require('mongoose');

var Schema = mongoose.Schema;  

var tweetSchema = new Schema({
  code_product: {
    type: Number,
    label: "code_product",
    unique: true
  },
  tweet: {
    type: String,
    label: "tweet",
    max: 500
  },
  ts_value: {
   type: Date,
   default: Date.now
  }
});

var TweetModel = mongoose.model('tweets', tweetSchema);

module.exports = TweetModel;