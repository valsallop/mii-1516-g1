var Product = require('./model/product');
var User = require('./model/user');
var Controller = require ('./controller');

module.exports = function(app) {

	// Get products to show on index
	app.get('/api/products', Controller.getProductsIndex);
	// Get recommended products to show on index
	app.get('/api/recommended', Controller.getRecommendedIndex);
	// User registration
	app.post('/api/registration', Controller.postCreateUser);

	app.get('/api/authenticate',Controller.authenticate);
	// Crear una nueva Persona
	//app.post('/sapi/persona', Controller.postCreateUser);

	//Autenciacion
	//app.post('/sapi/authenticate', Controller.postAuthenticate);

	//
	//app.use('/sapi',Controller.authenticate);
	/*// Modificar los datos de una Persona
	app.put('/api/persona/:persona_id', Controller.updatePersona);
	// Borrar una Persona
	app.delete('/api/persona/:persona_id', Controller.removePersona);
	//Ver susuarios
	app.get('/api/users', Controller.getAllUsers);
	*/
	// application 
	app.get('*', function(req, res) {
	var token = req.cookies.session;
	console.log("token"+token);

	if (token) {
		res.sendFile('../public/homeauth.html');
	}else{
		res.sendFile('../public/index.html'); // Carga única de la vista
	}
	});
	app.get('/index', function(req, res) {
	var token = req.cookies.session;
	console.log("token"+token);

	if (token) {
		res.sendFile('../public/homeauth.html');
	}else{
		res.sendFile('../public/index.html'); // Carga única de la vista
	}
	});
	
};