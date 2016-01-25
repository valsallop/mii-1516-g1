
var logger = require('winston');
var ProductModel = require('../models/products');

var ProductsHandler = function() {
	this.getAllProduct = handleGetAllProduct;
	this.getOneProduct = handleGetOneProduct;
	this.createOneProduct = handleCreateOneProduct;
	this.updateOneProduct = handleUpdateOneProduct;
	this.deleteOneProduct = handleDeleteOneProduct;
};

function handleGetAllProduct (req, res){
	return ProductModel.find(function (err, products) {
		logger.log('debug', "handleGetAllProduct");
		if (!err) {
				return res.send(products);
			} else {
				return console.log(err);
			}
	});
};

function handleGetOneProduct (req, res){
  return ProductModel.findOne({code: req.params.id}, function (err, product) {
		logger.log('debug', "handleGetOneProduct");
    if (!err) {
      return res.send(product);
    } else {
    	res.status(404);
    	res.send({ code: req.params.id, error: 'Not found' });
      return console.log(err);
    }
  });
};

function handleCreateOneProduct (req, res){
  var product;
  console.log("POST: ");
  console.log(req.body);
  product = new ProductModel({
    name: req.body.name, 
    cost: req.body.cost, 
    description: req.body.description, 
    image: req.body.image,
    code: req.body.code,
    availability: req.body.availability
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
    	res.status(400);
    	res.send({ code: product.code, error: err });
      return console.log(err);
    }
  });
  return res.send(product);
};

function handleUpdateOneProduct (req, res){
  return ProductModel.findOne({code: req.params.id}, function (err, product) {
    product.name= req.body.name; 
    product.cost= req.body.cost;
    product.description= req.body.description; 
    product.image= req.body.image;
    product.availability= req.body.availability;
    return product.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
    	res.status(400);
    	res.send({ code: product.code, error: err });
        console.log(err);
      }
      return res.send(product);
    });
  });
};

function handleDeleteOneProduct (req, res){
  return ProductModel.findOne({code: req.params.id}, function (err, product) {
    return product.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
    	res.status(400);
    	res.send({ code: product.code, error: err });
        console.log(err);
      }
    });
  });
};

module.exports = ProductsHandler;