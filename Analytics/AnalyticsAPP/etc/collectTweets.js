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
    });
    recolectTweets(productsName,productsCode);
  });


  function recolectTweets (productsName,productsCode) {
    var Twit = require('twit');

    var client = new Twit({
      consumer_key: "k1RcQeAr1sH6kxadMJREx09N5",
      consumer_secret: "YivtaDZ8z3gJdtZaIPX3SSnhBEetNddHZR9K1ipvfWRXxWLzTd",
      access_token: "4360924697-ItIRkCCWkAPQY1qjMtWWHVraNoBX6phHqJ062M4",
      access_token_secret: "3yPdIcdKPS7vKXynKhwya0fmC6bH8yguxGXtbZEoDISF6",
    });
    for (var i = 0; i <productsName.length; i++) {
      client.get('search/tweets', { q: productsName[i], count:100}, function(err, data) {
        data.statuses.forEach(function(tweet) {
          //console.log(tweet.id_str);
          //console.log(tweet.text);
          //console.log(tweet.created_at);

          var productTweets = {code_product: productsCode[i], tweet:tweet.id_str, ts_value:tweet.created_at};
          //saved tweets in model
          var ts = new TweetModel(product);
          ts.save(function (err) {
            if (err) return handleError(err);
            // saved!
          })
        }); 
      })
    };
  }
}
module.exports = CollectTweets;

