var logger = require('winston');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;  

var productSchema = new Schema({
  code: {
    type: Number,
    label: "code",
    unique: true
  },
  name: {
    type: String,
    label: "name",
    max: 1000
  },
  cost: {
    type: Number,
    label: "cost",
    decimal: true
  },
  description: {
    type: String,
    label: "description",
    optional: true,
    max: 1000
  },
  image: {
    type: String,
    label: "imageURL",
    optional: true,
    max: 1000
  },
  rating: {
    type: Number,
    label: "rating",
    decimal: true,
    default: 0
  },
  availability: {
  	type: Boolean,
  	default: 1
  },
  modified: {
   type: Date,
   default: Date.now
  }
});

productSchema.path('name').validate(function (v) {
    return v.length > 0;
}, 'Product name attribute should be more than 0 characters');
productSchema.path('cost').validate(function (v) {
    return v > 0;
}, 'Product cost attribute should be great than 0');
productSchema.path('rating').validate(function (v) {
    return v >= 0;
}, 'Product rating attribute should be great or equal than 0');


var ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;