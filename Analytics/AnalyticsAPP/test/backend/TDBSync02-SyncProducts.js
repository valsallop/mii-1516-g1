var request = require('supertest');
var should = require('should');
var assert = require('assert');
var async = require('async');
var config = require('../../config-dev');
var mongoose = require('mongoose');
var ProductModel = require('../../models/products');
var SyncProducts = require('../../etc/syncProducts');

console.log("Connecting to MongoDB...");
mongoose.connect(config.db.mongodb);

describe('Get all products from WebApp REST API & update local db with them.', function () {
	it('should match content of webApp response with local db products', function (){
		
		var products = [];
		async.parallel(
			[
			function (callback) {
				//console.info("Get products from DB");
				ProductModel.find( {}, function (err, dbProducts) {
					if (err) {
						return callback(err);
					} else {
						dbProducts.should.not.be.empty;
						products.dbProducts = dbProducts;
						callback();
					}
				}
				);
			},
			function (callback) {
				//console.info("Get products from web application REST API");
				request(config.webApp.address + config.webApp.collectionApi)
				.get('/products')
				.send()
				.end( function (err, res) {
					if (err) {
						return callback(err);
					} else {
						assert(res != null, "json-server must be serving products: http://localhost:3000/collectionapi/products")
						res.status.should.be.equal(200);
						assert(res.body.length > 0);
						products.webAppProducts = res.body; 
						callback();
					}
				}
				);
			}
			], function (err) {
	    	//console.log("Verify products match in both locations");
	    	//console.log("Errors: " + err);
	    	assert(!err);
	    	products.should.have.property('dbProducts');
	    	products.should.have.property('webAppProducts');
	    	products.dbProducts.should.have.lengthOf(322, "Must be 322  products in DB");
	    	products.webAppProducts.should.have.lengthOf(322, "Must be 322 products in web request");
	    	var BreakException= {};
	    	products.dbProducts.forEach( function( dbProduct ) {
	    		var result = false;
	    		try {
	    			products.webAppProducts.forEach( function( webAppProduct ) {
	    				if( webAppProduct.code == dbProduct.code) {
	    					result = webAppProduct.name == dbProduct.name
	    					&& webAppProduct.description == dbProduct.description;
	    					throw BreakException;
	    				}
	    			});
	    		} catch(e) {
	    			if (e!==BreakException) throw e;
	    		}
	    		assert(result,"Product are not equal db & web: " + dbProduct);
	    	});
	    	//console.log('DONE!');
	    });
	});
});
