/* meteor-pages controllers (server side)*/

/* Products in Home view*/
Pages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    perPage: 5
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