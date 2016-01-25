
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
    decimal: true
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
    console.log("validate name");
    console.log(v);
    return v.length > 0;
}, 'Product name attribute is should be more than 0 characters');


var ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;