var application_root = __dirname,
    express = require("express"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('winston'),
    morgan = require('morgan'), // log requests
    errorHandler = require('express-error-handler'),
    path = require("path"),
    fs = require('fs'),
    ProductsHandler = require('./handlers/ProductsHandler'),
    PopularityHandler = require('./handlers/PopularityHandler'),
    routes = require('./routes');

var app = express();

// Logger config
//fs.existsSync(path.join(application_root, "logs")) || fs.mkdirSync(path.join(application_root, "logs"));
//var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});

var winstonStream = {
    write: function(message, encoding){
        logger.info("Express: " + message);
    }
};
app.use(morgan('combined', {stream: winstonStream}));

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

exports.start = start;
exports.app = app;
