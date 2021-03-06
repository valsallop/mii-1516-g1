var SchemaRatings;

this.Ratings = new Meteor.Collection('ratings');

SchemaRatings = new SimpleSchema({
  userId: {
    type: String,
  },
  proId: {
    type: String
  },
  rating: {
    type: Number,
    decimal: true
  }
});
Meteor.startup(function() {
  Ratings.attachSchema(SchemaRatings);
});
