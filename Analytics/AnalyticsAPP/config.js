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
		"cronExp": "10 */15 * * * *"
	},
	"scheduleSyncProducts": {
		"cronExp": "40 */15 * * * *"
	},
	"scheduleProcessCollect":{
		"cronTwe": "10 */30 * * * *"
	},
	"webApp": {
		"address": "http://acmesupermarket.meteor.com",
		"collectionApi": "/collectionapi"
	}
};