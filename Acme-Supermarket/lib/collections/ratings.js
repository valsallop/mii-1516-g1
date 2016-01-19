var SchemaRatings;

Ratings = new Meteor.Collection('ratings');

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
Ratings.attachSchema(SchemaRatings);
