
console.log("controlador recommendations");

RecommendationPages = new Meteor.Pagination(Recommendations, {
    itemTemplate: "product",
    templateName: "recommendations",
    perPage: 5
});