var config = require('./config-dev');
var winston = require('winston');
var mongoose = require('mongoose');
var server = require('./server');
var schedule = require('./etc/schedule');


console.log("Starting logger...");
winston.add(winston.transports.File, {
	filename: config.logger.api,
	level: config.logger.level, 
	maxsize: config.logger.maxsize, 
    maxFiles: config.logger.maxFiles,
    json: false
});
// Uncaught exceptions into exceptions.log
winston.handleExceptions(new winston.transports.File({
	filename: config.logger.exception, 
	maxsize: config.logger.maxsize, 
	maxFiles: config.logger.maxFiles
}));
console.log("logger started.");

console.log("Connecting to MongoDB...");
mongoose.connect(config.db.mongodb);
console.log("successfully connected to DB.");
console.log("Starting web server...");
server.start();
winston.info("Server started.");
console.log("Successfully started web server. Waiting for incoming connections...");

