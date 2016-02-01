ProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "allProducts",
    perPage: 12
});
