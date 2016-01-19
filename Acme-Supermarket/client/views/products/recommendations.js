this.RecommendationPages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "recommendations",
    perPage: 5,
    sort:{
    	rating: -1
    }

});