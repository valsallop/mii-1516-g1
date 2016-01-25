var config = require('../config-dev');
var logger = require('winston');
var cron = require('node-schedule');
var ProcessPopularity = require('../etc/processPopularity');

cron.scheduleJob(config.scheduleProcessPopularity.cronExp, ProcessPopularity);
logger.log('info', "Scheduler started.");
