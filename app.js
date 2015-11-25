// INIT
var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser  = require("body-parser");
var methodOverride = require("method-override");
//var logger = require('express-logger');
var mongoose = require('mongoose');

//Login
var cookieParser = require('cookie-parser')

var morgan      = require('morgan');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./services/model/user'); // get our mongoose model

//App

var app = express();
var port  	 = process.env.PORT || 8080; 			// Reserve port 8080
app.use(cookieParser())

// CONFIG DB

//mongoose.connect(config.database); // connect to database
//app.set('superSecret', config.secret); // secret variable
//mongoose.connect('mongodb://localhost:27017/ACMESMDB');
app.use(express.static(__dirname + '/public')); // 	
//app.use(logger({path: __dirname + "./logfile.txt"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(bodyParser.json());						
app.use(methodOverride());


console.log('APP configuration\tloaded...');
// Load endpoints
require('./services/routes.js')(app);

//Autenticacion
//var apiRoutes = express.Router(); 

console.log('APP services\tloaded...');


// Run server
app.listen(port);
console.log('APP served on port\t'+ port);

