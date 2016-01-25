function setup(app, handlers) {
	app.get('/api/products', handlers.products.getAllProduct);
	app.get('/api/products/:id', handlers.products.getOneProduct);
	app.post('/api/products', handlers.products.createOneProduct);
	app.put('/api/products/:id', handlers.products.updateOneProduct);
	app.delete('/api/products/:id', handlers.products.deleteOneProduct);

	app.post('/analytics/trending', handlers.popularity.getProductTwitterTrend);
	app.get('/analytics/recommendation', handlers.popularity.getRecommendationByPopularity);
}

exports.setup = setup;
