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
	console.log('User received to register:\t' + req.body.email);
	// Validate fields
	if(
		req.body.name.length <= 0 ||
		req.body.surname.length <= 0 ||
		req.body.email.length <= 0 ||
		req.body.address.length <= 0 ||
		req.body.credit_card.length <= 0 ||
		!req.body.admin
		){
		console.log('User received to register not valid:\t' + req.body);
		res.status(500);
		res.send('User not valid');
		return
	}
	// Validate duplicates
	/*
	if (User.find(
		{name: req.body.name, surname: req.body.surname, email: req.body.email}).count() > 0){
			console.log('User received to register duplicated:\t' + req.body.email);
			res.status(500);
			res.send('User duplicated');
			return;
	}
	*/
	User.create({
		name : req.body.name,
		surname: req.body.surname,
		email: req.body.email,
		address: req.body.address,
		gps_coord: req.body.gps_coord,
		credit_card: req.body.credit_card,
		password: req.body.password,
		admin: req.body.admin
	}, function(err, user) {
		if (err){
			res.send(err);
		}else{
			//	If success then it returns user inserted
			User.find(
				{name: req.body.name, surname: req.body.surname, email: req.body.email},
				function(err, user) { 
					if (err) {
						console.log('User NOT saved:\t' + req.body.email);
			 			res.send(err)
					}else{
						console.log('User saved successfully:\t' + req.body.email);
			 			res.json(user);
			 		}
			 	}
			);
		}
	});
};

// Authenticate
exports.postAuthenticate = function (req, res){
	// find the user
	console.log("TEST");
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

	var token = req.cookies.session;
	console.log("token"+token);

	if (token) {
		res.redirect('/homeauth.html');
	}else{
		res.redirect('/index.html');
	}
	
};