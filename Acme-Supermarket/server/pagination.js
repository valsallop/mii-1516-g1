/* meteor-pages controllers (server side)*/

/* Products in Home view*/
AdminProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "productAdmin",
    templateName: "productsAnalitycs",
    perPage: 12
});

SalesProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "salesProducts",
    templateName: "salesPro",
    perPage: 12
});

Pages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "products",
    perPage: 4,
    filters : {availability: {$eq: 1}}
});

/* Recommendations in Home view*/
this.RecommendationPages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "recommendations",
    perPage: 4,
    filters : {availability: {$eq: 1}},
    sort:{
    	rating: -1
    }

});

this.ProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "allProducts",
    perPage: 12,
    filters : {availability: {$eq: 1}}
});


