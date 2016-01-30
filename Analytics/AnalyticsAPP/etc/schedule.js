var config = require('../config-dev');
var logger = require('winston');
var cron = require('node-schedule');
var ProcessPopularity = require('../etc/processPopularity');
var SyncProducts = require('../etc/syncProducts');
var CollectTweets = require('../etc/collectTweets');

//	It executes job to process Popularity
cron.scheduleJob(config.scheduleProcessPopularity.cronExp, ProcessPopularity);
//	It executes job to syncronize Products between of web app and local db
cron.scheduleJob(config.scheduleSyncProducts.cronExp, SyncProducts);
//	It executes job to collect tweets of products
cron.scheduleJob(config.scheduleProcessCollect.cronTwe, CollectTweets);

logger.log('info', "Scheduler started.");
