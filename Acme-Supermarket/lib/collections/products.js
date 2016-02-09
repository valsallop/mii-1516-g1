Products = new Meteor.Collection('products');
productSchema=new SimpleSchema({
  code: {
    type: Number,
    label: "code",
    index: true,
    unique: true,
    autoValue: function() {
      if (this.isInsert) {
        return Products.find().count()+1;
      }
    }
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
    autoValue: function() {
      if (this.isInsert) {
        return 0;
      }
    }
  },
  availability: {
    type: Number,
    label: "availability",
    autoValue: function() {
      if (this.isInsert) {
        return 1;
      }
    }
  },
  supplierId: {
    type: String
  },
  tags:{
    type:[String]
  }
});
Products.attachSchema(productSchema);

ProductsServices = {
  getProduct: function (code) {
    return Products.findOne(code);
  },
  setProduct: function (code){
    Products.update({code:code},{$set:
      {
        name : "Test update",
        cost : 5,
        description : "Test update",
        image : "",
        code : 25,
        rating : 2.5,
        availability : 1
      }}
    );
  },
  productsExist: function (code) {
    return Products.find({code:code}).count() != 0;
  }
};
