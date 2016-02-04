Products = new Meteor.Collection('products');
productSchema=new SimpleSchema({
  code: {
    type: Number,
    label: "code",
    index: true,
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
    type: Number,
    label: "availability"
  }
});
Products.attachSchema(productSchema);
Products.prototype = {
  save: function() {
      // remember the context since in callback it is changed
      var that = this;
      var doc = {code: this.code,name: this.name,cost: this.cost,description: this.description,image: this.image,rating: this.rating, availability: this.availability};

      Products.insert(doc, function(error, result) {
          that._id = result;
      });
  }
};

Products.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === Meteor.userId() && Roles.userIsInRole(userId, "admin"));
  }
});