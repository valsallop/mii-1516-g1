Template.allProducts.helpers({
  allProducts: function() {
    return Products.find();
  }
});

ProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "allProductsDetails",
    templateName: "allProducts",
    perPage: 5
});

Template.allProductsDetails.rendered = function () {
  this.$('.rateit').rateit();
}