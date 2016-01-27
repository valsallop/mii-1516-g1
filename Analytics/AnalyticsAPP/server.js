var application_root = __dirname,
    express = require("express"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'); // log requests
    errorHandler = require('express-error-handler'),
    path = require("path"),
    fs = require('fs'),
    ProductsHandler = require('./handlers/ProductsHandler'),
    PopularityHandler = require('./handlers/PopularityHandler'),
    routes = require('./routes');

var app = express();

// Logger config
fs.existsSync(path.join(application_root, "logs")) || fs.mkdirSync(path.join(application_root, "logs"))
var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});
app.use(morgan('combined', {stream: expressLogFile}));

app.use(express.static(path.join(application_root, "public")));
if ('development' == app.get('env')) {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
if ('production' == app.get('env')) {
    app.use(errorHandler());
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Parse JSON documents
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Config server
app.use(methodOverride());
app.set('port', (process.env.PORT || 4242));


// Set-up handlers
var handlers = {
  products: new ProductsHandler(),
  popularity: new PopularityHandler()
};


function start() {
  routes.setup(app, handlers);
  app.listen(app.get('port'));
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
}


var ProductModel = require('./models/products');
var productsArray = [];

function productos () {
  var str = "";
  var str2 = ProductModel.findOne({ 'code': 1 }, 'name', function (err, product) {
    if (err) return handleError(err);
    str = product.name;
    cb(product.name);
  });
  return str2;
}

//console.log(productos());

/*
for (var i = 0; i<322;i++){
  ProductModel.findOne({ 'code': i+1 }, 'name', function (err, product) {
    if (err) return handleError(err);
    var str = product.name;
    var words = str.split(" ");
    productsArray[i] = words[0]+" "+words[1]+" "+words[2];
  });
  console.log(productsArray[i]);
}
console.log(productsArray);*/


function recolectTweets () {
  var Twit = require('twit');

  var client = new Twit({
    consumer_key: "k1RcQeAr1sH6kxadMJREx09N5",
    consumer_secret: "YivtaDZ8z3gJdtZaIPX3SSnhBEetNddHZR9K1ipvfWRXxWLzTd",
    access_token: "4360924697-ItIRkCCWkAPQY1qjMtWWHVraNoBX6phHqJ062M4",
    access_token_secret: "3yPdIcdKPS7vKXynKhwya0fmC6bH8yguxGXtbZEoDISF6",
  });

  /**
   * Stream statuses filtered by keyword
   * number of tweets per second depends on topic popularity
   **/
   
  var TweetModel = require('./models/tweets');
  var params = ['nivea','colgate'];
  var stream = client.stream('statuses/filter', { track: params });
  var tweetsArray = [];
  stream.on('tweet', function (tweet) {
      console.log(tweet.text);
      console.log(tweet.created_at);
      var code = 0;
      for (var i = 0; i<params.length;i++){
        if(tweet.text.toLowerCase().indexOf(params[i]) > -1){
          console.log(i+1);
          code = i+1;
        }
      }
      var product = {code_product: code, tweet:tweet.text, ts_value:tweet.created_at};

      //saved tweets in model
      var ts = new TweetModel(product);
      ts.save(function (err) {
        if (err) return handleError(err);
        // saved!
      })
      tweetsArray.push(product);
      console.log('----------Arraytweets-------------');
      console.log(tweetsArray);
  });
}

recolectTweets();

exports.start = start;
exports.app = app;
