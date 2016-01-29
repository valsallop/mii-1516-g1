var config = require('../config-dev');
var logger = require('winston');
var cron = require('node-schedule');
var ProcessPopularity = require('../etc/processPopularity');

var CollectTweets = require('../etc/collectTweets');

cron.scheduleJob(config.scheduleProcessPopularity.cronExp, ProcessPopularity);
cron.scheduleJob(config.scheduleProcessCollect.cronTwe, CollectTweets);
logger.log('info', "Scheduler started.");
