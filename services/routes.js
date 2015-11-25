var Product = require('./model/product');
var User = require('./model/user');
var Controller = require ('./controller');

module.exports = function(app) {

	// Get products to show on index
	app.get('/api/products', Controller.getProductsIndex);
	// Get recommended products to show on index
	app.get('/api/recommended', Controller.getRecommendedIndex);
	// Crear una nueva Persona
	app.post('/sapi/persona', Controller.postCreateUser);

	//Autenciacion
	app.post('/sapi/authenticate', Controller.postAuthenticate);

	//
	app.use('/sapi',Controller.authenticate);
	/*// Modificar los datos de una Persona
	app.put('/api/persona/:persona_id', Controller.updatePersona);
	// Borrar una Persona
	app.delete('/api/persona/:persona_id', Controller.removePersona);
	//Ver susuarios
	app.get('/api/users', Controller.getAllUsers);
	*/
	// application 
	app.get('*', function(req, res) {
		res.sendFile('../public/index.html'); // Carga única de la vista
	});
};