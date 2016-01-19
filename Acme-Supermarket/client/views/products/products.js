Pages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "products",
    perPage: 5
});