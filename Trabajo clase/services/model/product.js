var mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
	code: String,
	name: String,
	cost: Number,
	description: String,
	rating: Number
});