
var mongoose = require('mongoose');

var Schema = mongoose.Schema;  

var popularitySchema = new Schema({
  code_product: {
    type: Number,
    label: "code_product",
    unique: true
  },
  popularity: {
    type: Number,
    label: "popularity",
    decimal: true,
    min: 0,
    max: 5
  }
});


var PopularityModel = mongoose.model('popularity', popularitySchema);

module.exports = PopularityModel;