
var mongoose = require('mongoose');

var Schema = mongoose.Schema;  

var confSchema = new Schema({
  key_setting: {
    type: String,
    label: "key_setting",
    max: 1000
  },
  value: {
    type: String,
    label: "value",
    default: "",
    max: 1000
  },
  modified: {
   type: Date,
   default: Date.now
  }
});


var ConfModel = mongoose.model('conf', confSchema);

module.exports = ConfModel;