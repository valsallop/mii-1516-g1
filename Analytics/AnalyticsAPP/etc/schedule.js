var config = require('../config-dev');
var logger = require('winston');
var CronJob = require('cron').CronJob;
var ProcessPopularity = require('../etc/processPopularity');
var SyncProducts = require('../etc/syncProducts');
var CollectTweets = require('../etc/collectTweets');


// It executes job to process Popularity
try {
	var jobProcessPopularity = new CronJob({
		cronTime: config.scheduleProcessPopularity.cronExp,
		onTick: ProcessPopularity,
		onComplete: function() {
			logger.log('debug', "ProcessPopularity finished.");
		},
		start: true
	});
} catch(ex) {
	console.log("scheduleProcessPopularity cronExp invalid.");
}

// It executes job to syncronize Products between of web app and local db
try {
	var jobSyncProducts = new CronJob({
		cronTime: config.scheduleSyncProducts.cronExp,
		onTick: SyncProducts,
		onComplete: function() {
			logger.log('debug', "SyncProducts finished.");
		},
		start: true
	});
} catch(ex) {
	console.log("scheduleSyncProducts cronExp invalid.");
}

//	It executes job to collect tweets of products
try {
	var jobCollectTweets = new CronJob({
		cronTime: config.scheduleProcessCollectTweets.cronExp,
		onTick: CollectTweets,
		onComplete: function() {
			logger.log('debug', "CollectTweets finished.");
		},
		start: true
	});
} catch(ex) {
	console.log("scheduleProcessCollectTweets cronExp invalid.");
}

logger.log('info', "Scheduler started.");
