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

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

app.use(express.static(__dirname + '/public')); // 	

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

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 3600 // expires in 1 hours
				});
				res.cookie('session' ,token);
				res.redirect('http://localhost:8080/api/users')
				
				/*
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});*/
			}		

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'] || req.cookies.session;

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		console.log("Cookies: ", req.cookies)
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/sapi', apiRoutes);



// Run server
app.listen(port);
console.log('APP served on port\t'+ port);

