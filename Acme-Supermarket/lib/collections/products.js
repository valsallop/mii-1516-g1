this.Products = new Meteor.Collection('products');
productSchema=new SimpleSchema({
  code: {
    type: Number,
    label: "code"
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
  }
});
Products.attachSchema(productSchema);