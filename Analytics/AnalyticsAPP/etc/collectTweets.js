var ProductModel = require('../models/products');
var TweetModel = require('../models/tweets');


var CollectTweets =  function collectTweets () {

  ProductModel.find({}, function(err, products) {
    var productsName = [];
    var productsCode = [];

    products.forEach(function(product) {
      var str = product.name;
      var words = str.split(" ");
      var res = words[0]+" "+words[1];
      productsName.push(res);
      productsCode.push(product.code);
      recolectTweets(res,product.code);
    });
  });

  function recolectTweets (productsName,productsCode) {
    var Twit = require('twit');

    var client = new Twit({
      consumer_key: "k1RcQeAr1sH6kxadMJREx09N5",
      consumer_secret: "YivtaDZ8z3gJdtZaIPX3SSnhBEetNddHZR9K1ipvfWRXxWLzTd",
      access_token: "4360924697-ItIRkCCWkAPQY1qjMtWWHVraNoBX6phHqJ062M4",
      access_token_secret: "3yPdIcdKPS7vKXynKhwya0fmC6bH8yguxGXtbZEoDISF6",
    });
      
    client.get('search/tweets', { q: productsName, count:10}, function(err, data) {
      if (!err) {
        data.statuses.forEach(function(tweet) {
          
          TweetModel.findOne({tweet:tweet.id_str, code_product:productsCode}, function(err, tweetmod) {
            
            if(tweetmod == null){//no repite tweets
              var productTweets = {code_product: productsCode, tweet:tweet.id_str, ts_value:tweet.created_at};
              //saved tweets in model
              var ts = new TweetModel(productTweets);
              ts.save(function (err) {
                if (err) return handleError(err);
              });
            }
          });
        }); 
      } else {
        console.log("There was an error getting a public Tweet. Abandoning EVERYTHING :(");
      }
    })
  }
}
module.exports = CollectTweets;

