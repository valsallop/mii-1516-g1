var config = require('../config-dev');
var logger = require('winston');
var cron = require('node-schedule');
var ProcessPopularity = require('../etc/processPopularity');

var CollectTweets = require('../etc/collectTweets');
CollectTweets();

cron.scheduleJob(config.scheduleProcessPopularity.cronExp, ProcessPopularity);
logger.log('info', "Scheduler started.");
