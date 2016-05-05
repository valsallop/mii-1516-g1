var logger = require('winston');
var config = require('../config-dev');
var ProductModel = require('../models/products');
var TweetModel = require('../models/tweets');
var ConfModel = require('../models/conf');
var Twit = require('twit');

// Collect leatest tweets of products & save its mentions
var CollectTweets =  function collectTweets () {

  ConfModel.findOne({key_setting: "collectTweets"} , function(err, confTweet) {
    var lastProduct = 0;
    if (!err && confTweet != null) {
      lastProduct = Number(confTweet.value) != NaN ? Number(confTweet.value) : 0;
    }

    logger.log('info',  "Collect tweets from product: " + lastProduct);
    var q = ProductModel.find({code: {"$gt": lastProduct}}).sort({code: 1}).limit(config.collectTweets.productsPerRequest);
    q.exec( function(err, products) {
      if (!err) {
        var productsName = [];
        var productsCode = [];

        products.forEach(function(product) {
          var str = product.name;
          var words = str.split(" ");
          var res = words[0]+" "+words[1];
          productsName.push(res);
          productsCode.push(product.code);
          recollectTweets(res, product.code);
        });
        if (!products || products.length<1)
          updateLastTweetCollected(0);
        else
          updateLastTweetCollected(products[products.length - 1].code);
      } else {
        logger.log('warn',  "Error getting Products:\t" + err);
      }
    });
  });
}

function recollectTweets (productsName, productCode) {
  logger.log('debug',  "Collect tweets connecting to Twitter API, product:" + productCode);
  var client = new Twit({
    consumer_key: config.tweeterAPI.consumer_key,
    consumer_secret: config.tweeterAPI.consumer_secret,
    access_token: config.tweeterAPI.access_token,
    access_token_secret: config.tweeterAPI.access_token_secret
  });

  logger.log('silly',  "Collect tweets get tweets, product:" + productCode);
  var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var today = yyyy+'-'+mm+'/'+dd;
  client.get('search/tweets', { q: productsName, count: config.collectTweets.tweetsPerRequest}, function(err, data) {
    if (!err) {
		logger.log('silly',data)
      logger.log('silly',  "Collect tweets, product: " + productCode + "\tcount: " + data.statuses.length);
      data.statuses.forEach(function(tweet) {
        logger.log('silly',  "Collect tweets save:  " + tweet);
        TweetModel.findOne({tweet:tweet.id_str, code_product:productCode}, function(err, tweetmod) {
            if(tweetmod == null){//no repite tweets
              var productTweet = {code_product: productCode, tweet:tweet.id_str, ts_value:tweet.created_at,lang:tweet.lang,message:tweet.text};
              //saved tweets in model
              var ts = new TweetModel(productTweet);
              ts.save(function (err) {
                if (err) {
                  logger.log('warn',  err);
                }
              });
            } else {
              logger.log('silly',  "Collect tweets tweet already exists:  " + tweet.id_str);
            }
          });
      }); 
    } else {
      logger.log('warn',  "Error getting Tweet:\t" + err);
    }
  });
}

function updateLastTweetCollected(productCode) {
  logger.log('debug', "Update last collect tweets product: " + productCode);
  ProductModel.find({code: {"$gt": productCode}}, function(err, products) {
    if (err || !products) {
      productCode = 0;
    }

    ConfModel.findOne({key_setting: "collectTweets"} , function(err, confTweet) {
      if (err) {
        logger.log('warn',  err );
      } else {
        if(confTweet == null) {
          var conf = new ConfModel({key_setting: "collectTweets", value: productCode, modified: new Date()});
          conf.save(function (err) {
            if (err) logger.log('silly',  err );
            else{
              logger.log('silly', "Collect tweets conf last request saved: " + conf);
            }
          });
        } else {
          ConfModel.update(
            { key_setting: "collectTweets" },
            { $set: { value: productCode, modified: new Date() }},
            function (err) {
              if (err) logger.log('warn',  err);
              else logger.log('silly', "Collect tweets conf last request updated, product: " + productCode);
            })
        }
      }
    });
  });
}

module.exports = CollectTweets;

