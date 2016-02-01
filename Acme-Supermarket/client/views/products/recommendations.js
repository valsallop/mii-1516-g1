this.RecommendationPages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "recommendations",
    perPage: 4,
    sort:{
    	rating: -1
    }

});