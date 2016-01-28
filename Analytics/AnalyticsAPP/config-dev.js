module.exports = {
	"db": {
		//"mongodb": "mongodb://testUser:testpassword@ds045077.mongolab.com:45077/shopwithmetest"
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
		"cronExp": "10 */1 * * * *"//"segundos, minutos, hora, dia, mes, dia de la semana"
	},
	"scheduleProcessCollect":{
		"cronTwe": "10 */20 * * * *"
	}
};
