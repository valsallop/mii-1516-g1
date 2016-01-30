module.exports = {
	"db": {
		//"mongodb": "mongodb://testUser:testpassword@data.mongolab.com:45077/tests"
		// Localhost
		"mongodb": "mongodb://localhost/analytic"
	},
	"logger": {
		"level": "silly",
		"maxsize": 1000000,
		"maxFiles": 10,
		"api": "./logs/api.log",
		"exception": "./logs/exceptions.log"
	},
	"scheduleProcessPopularity": {
		"cronExp": "10 */1 * * * *"
	},
	"scheduleSyncProducts": {
		"cronExp": "10 */1 * * * *"
	},
	"scheduleProcessCollect":{
		"cronTwe": "10 */30 * * * *"
	},
	"webApp": {
		"address": "http://localhost:3000",
		"collectionApi": "/collectionapi"
	}
};
