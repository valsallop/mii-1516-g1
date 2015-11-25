var Persona = require('./model/product');
var User = require('./model/user');
// Get all of products in DB
exports.getProductsIndex = function (req, res){
	/*Product.find(
		function(err, product) {
			if (err)
				res.send(err)
					res.json(product); // return Products into JSON	
				}
			);*/
	// Testing purpose only
	var products = [];
	for (var i=0; i<14; i++) {
        products.push({
            code:   i,
            name: "the name" + i,
            description: "the description DBMock" + i,
            cost: 100 + i,
            rating: 3
            }
        );
	}
    res.json(products);
};

// Get all of products in DB
exports.getRecommendedIndex = function (req, res){
	/*
	Product.find(
		function(err, product) {
			if (err)
				res.send(err)
					res.json(product); // return recommendations into JSON	
				}
			);
	*/
	// Testing purpose only
	var products = [];
	for (var i=0; i<10; i++) {
        products.push({
            code:   i,
            name: "the name" + i,
            description: "recommendation's description DBMock" + i,
            cost: 100 + i,
            rating: 3
            }
        );
	}
	res.json(products);
};

// Post create user
exports.postCreateUser = function (req, res){
	var nick = new User({ 
		name: 'test',
		surname:'test',
		email: 'test@test.test',
		address: 'test',
		gps_coord: 'test',
		credit_card:'test',
		password: 'test',
		admin: true 
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
};

// Authenticate
exports.postAuthenticate = function (req, res){
	// find the user
	User.findOne({
		email: req.body.email
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
				res.redirect('http://localhost:8080/api/homeauth?token='+token)
				
				/*
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});*/
			}		

		}

	});
};

exports.authenticate = function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'] || cookies.get("session");

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
	
};