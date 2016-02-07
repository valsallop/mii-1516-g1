module.exports = {
	"db": {
		"mongodb": "mongodb://localhost/analytic"
	},
	"logger": {
		"level": "info",
		"maxsize": 1000000,
		"maxFiles": 10,
		"api": "./logs/api.log",
		"exception": "./logs/exceptions.log"
	},
	"scheduleProcessPopularity": {
		"cronExp": "00 */15 * * * *"
	},
	"scheduleSyncProducts": {
		"cronExp": "40 */30 * * * *"
	},
	"scheduleProcessCollectTweets":{
		"cronExp": "10 */5 * * * *"
	},
	"collectTweets":{
		"productsPerRequest": 10,
		"tweetsPerRequest": 15
	},
	"tweeterAPI": {
		"consumer_key": "k1RcQeAr1sH6kxadMJREx09N5",
		"consumer_secret": "YivtaDZ8z3gJdtZaIPX3SSnhBEetNddHZR9K1ipvfWRXxWLzTd",
		"access_token": "4360924697-ItIRkCCWkAPQY1qjMtWWHVraNoBX6phHqJ062M4",
		"access_token_secret": "3yPdIcdKPS7vKXynKhwya0fmC6bH8yguxGXtbZEoDISF6"
	},
	"webApp": {
		"address": "http://acmesupermarket.meteor.com",
		"collectionApi": "/collectionapi"
	}
};