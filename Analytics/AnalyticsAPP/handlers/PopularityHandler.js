
var logger = require('winston');
var utils = require('../etc/utils');
var TweetModel = require('../models/tweets');
var PopularityModel = require('../models/popularity');

var PopularityHandler = function() {
	//this.getProductPopularity = handleGetProductPopularity;
	//this.getProductRecommendationList = handleGetProductRecommendationList;
    this.getProductTwitterTrend = handleGetProductTwitterTrend;
    this.getRecommendationByPopularity = handleGetRecommendationByPopularity;
};


function handleGetProductTwitterTrend (req, res){
  logger.log('debug', "handleGetOneProduct code_product: " + req.body.code);
  return TweetModel.aggregate([
    {
            $match: {
                ts_value: {
                    $gte: utils.parseISODate(req.body.ts_init),
                    $lt: utils.parseISODate(req.body.ts_end)
                }
            }
    },{
        $group : {
            _id : {
                code: "$code_product",
                month: { $month: "$ts_value" },
                day: { $dayOfMonth: "$ts_value" },
                year: { $year: "$ts_value" }
            },
            mentions: { $sum: 1 }
        }
      }], function (err, data) {
    if (!err) {
      data2res = { code: req.body.code, trending: [] };
      data.forEach(function(row){
        var ts_local =  new Date(row._id.year, row._id.month-1, row._id.day) ;
        data2res.trending.push({ts: utils.parseDate2ISO(ts_local), mentions: row.mentions });
      });
      return res.send(data2res);
    } else {
      res.status(404);
      res.send({ code: req.body.code, error: 'Error:'+ err });
      return logger.log('warn', err);
    }
  });
  
};

function handleGetRecommendationByPopularity (req, res){
    logger.log('debug', "handleGetRecommendationByPopularity");
    
    // returns popularity collection
    return PopularityModel.find(function (err, data) {
        if (!err) {
            logger.log('silly', "Send recommendation list: " + data);
            return res.send(data);
        } else {
            res.status(404);
            res.send({error: 'Error:'+ err });
            return logger.log('warn', err);
        }
    });
};


module.exports = PopularityHandler;