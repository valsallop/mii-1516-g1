module.exports = {
	"db": {
		"mongodb": "mongodb://localhost/analytic"
	},
	"logger": {
		"api": "logs/api.log",
		"exception": "logs/exceptions.log"
	},
	"scheduleProcessPopularity": {
		"cronExp": "10 */15 * * * *"
	}
};
