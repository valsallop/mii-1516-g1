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
            logger.log('silly', "SyncProducts request success: " + response.statusCode + "\tproducts received: " + body.length);
            var products = JSON.parse(body);
            if(products.length > 0){
                ProductModel.remove({}, function (err, data) {
                    if (!err) {
                        logger.log('debug', "SyncProducts Product collection cleaned");
                        products.forEach( function(product) {
                            delete product._id;
                            var popProduct = new ProductModel(product);
                            popProduct.save(function (err) {
                                if (err) {
                                    logger.log('info', "SyncProducts Product NOT saved code: " + product.code + ",\tname = " + product.name+ ",\terr = " + err);
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
