/* meteor-pages controllers (server side)*/

/* Products in Home view*/
AdminProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "productAdmin",
    templateName: "productsAnalitycs",
    perPage: 10
});

Pages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "products",
    perPage: 5,
    filters : {availability: {$eq: 1}}
});

/* Recommendations in Home view*/
this.RecommendationPages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "recommendations",
    perPage: 5,
    sort:{
    	rating: -1
    }

});

ProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "allProductsDetails",
    templateName: "allProducts",
    perPage: 5,
    filters : {availability: {$eq: 1}}
});

