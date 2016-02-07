module.exports = {
	"db": {
		//"mongodb": "mongodb://testUser:testPassword@data.mongolab.com:45077/tests"
		// Localhost
		"mongodb": "mongodb://localhost/analytic"
	},
	"logger": {
		"level": "debug",
		"maxsize": 1000000,
		"maxFiles": 10,
		"api": "./logs/api.log",
		"exception": "./logs/exceptions.log"
	},
	"scheduleProcessPopularity": {
		"cronExp": "0,30 * * * * *"
	},
	"scheduleSyncProducts": {
		"cronExp": "5,35 * * * * *"
	},
	"scheduleProcessCollectTweets":{
		"cronExp": "25,40 * * * * *"
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
		"address": "http://localhost:3000",
		"collectionApi": "/collectionapi"
	}
};
