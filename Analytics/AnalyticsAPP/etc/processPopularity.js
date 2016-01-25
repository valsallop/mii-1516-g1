
var logger = require('winston');
var ProductModel = require('../models/products');
var TweetModel = require('../models/tweets');
var PopularityModel = require('../models/popularity');

var ProcessPopularity = function processPopularity() {
// Calculate popularity & insert into collection
    PopularityModel.remove({}, function (err, data) {
        if (!err) {
            logger.log('silly', "Popularity collection cleared");
        } else {
            logger.log('warn', err);
        }
    });

    var limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() - 3);

    ProductModel.find({},{code: 1}, function (err, data) {
        if (!err) {
            logger.log('silly', "Getting available products (count): " + data.length);
            var availableCodeProducts = data.map(function(doc) { return doc.code; });
            // Get tweets of available products
            TweetModel.aggregate(
                [{ $match: {
                        ts_value: {
                            $gt: limitDate
                        },
                        code_product: {
                            $in: availableCodeProducts
                        }

                    }
                },{
                    $group : {
                        _id : {
                            code: "$code_product"
                        },
                        mentions: {
                            $sum: 1
                        }
                    }
                },{
                    $sort : {
                        "mentions": -1
                    }
                }], function (err, data) {
                    if (!err) {
                        var maxMentions = 0;
                        logger.log('debug', "Popularity collection. Data 2 populate: " + data);
                        if(data.length > 0){
                            data.forEach( function(row) {
                                if(maxMentions < row.mentions)    maxMentions=row.mentions;
                                if(row.mentions>0 && maxMentions>0){
                                    var popDoc = new PopularityModel({
                                        code_product : row._id.code,
                                        popularity : (row.mentions / maxMentions) * 5
                                    });
                                    popDoc.save(function (err) {
                                        if (err) {
                                            return err;
                                        } else {
                                            logger.log('silly', "Popularity document saved code_product: " + row._id.code + ", popularity = " + ((row.mentions / maxMentions) * 5));
                                        }
                                    });
                                } else {
                                    logger.log('silly', "Popularity document not saved: " + row._id.code + ", mentions = " + row.mentions + ", maxMentions: " + maxMentions);
                                }
                            });
                    }} else {
                        logger.log('warn', err);
                    }
                }
                );


        } else {
            logger.log('warn', "Error getting available products: "+ err);
        }
    });
}
module.exports = ProcessPopularity;
