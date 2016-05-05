var config = require('../config-dev');
var logger = require('winston');
var request = require('request');
var ProductModel = require('../models/products');

//  Sincronizes Product collection between web application db and local db.
//  It gets all Products from web application and insert them into local db.
var SyncProducts = function syncProducts() {
    request({
        url: config.webApp.address + config.webApp.collectionApi + '/products',
        method: 'GET'
    }, function(err, response, body){
        if(err) {
            logger.log('warn', "SyncProducts request " + err);
            return err;
        } else if(response.statusCode != 200) {
            logger.log('warn', "SyncProducts request status: " + response.statusCode + "\terror: " + response);
            return err;
        } else {
            var products = JSON.parse(body);
            logger.log('info', "SyncProducts request success: " + response.statusCode + "\tproducts received: " + products.length);
            if(products.length > 0){
                ProductModel.remove({}, function (err, data) {
                    if (!err) {
                        logger.log('silly', "SyncProducts Product collection cleaned");
                        products.forEach( function(product) {
                            delete product._id;
                            delete product.rating
                            var popProduct = new ProductModel(product);
                            popProduct.save(function (err) {
                                if (err) {
                                    logger.log('warn', "SyncProducts Product NOT saved code: " + product.code + ",\tname = " + product.name+ ",\terr = " + err);
                                    return err;
                                }
                            });
                        });
                    } else {
                        logger.log('warn', "SyncProducts Product collection NOT cleaned: " + err);
                    }
                });

            }
        }
    }
);
}

module.exports = SyncProducts;
