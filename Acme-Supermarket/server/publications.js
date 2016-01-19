Meteor.publish('products', function() {
  return Products.find();
});

Meteor.publish('comments', function() {
  return Comments.find();
});

Meteor.publish('ratings', function() {
  return Ratings.find();
});

Meteor.publish('recommendations', function() {
  return Recommendations.find({}, {limit: 3});
});

// Only publish data for the matches we care about. Be careful not to over-publish
Meteor.publish('AvgRatings', function(proId, proObj) {
  
  // Define our aggregation pipeline
  var pipeline = [
    {$match : {proId: proId}}, 
    {
      $group: {
        _id: proId,
        avg: {
          $avg: '$rating'
        }
      }
    }
  ];
  Ratings.aggregate(pipeline);
  //ponemos el objeto id y el resultado del aggregate
  Products.update({_id:proObj}, {
              $set: {rating: parseFloat(Ratings.aggregate(pipeline)[0].avg)}
            });
});
console.log("Publicando recommendations");

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'name': 1, 'surname': 1,'address': 1,'creditCard':1}});
  } else {
    this.ready();
  }
});

Ratings.allow({
  insert: function() {
    return true;
  }
});

Comments.allow({
  insert: function(userId, doc) {
    return doc && doc.userId === userId;
  }
});

Meteor.users.permit('update').ifHasRole('admin').exceptProps(['roles', 'services']).apply();
Meteor.users.permit('update').ifHasUserId(this.userId).exceptProps(['roles', 'services']).apply();
Meteor.users.permit(['insert']).apply();
Products.permit(['insert','update']).ifHasRole('admin').apply();

if(Meteor.isServer){
	Meteor.users.before.insert(function(userId, doc){
    doc.lastLogin=new Date();
    doc.name=null;
    doc.surname=null;
    doc.address={name: null,number:null,postalCode:null};
    doc.coordinates={lat: null, lon:null};
    doc.creditCard={number:null,CVV:null,expMonth:null,expYear:null};
    console.log(doc);
  });
  Meteor.users.after.insert(function(userId, doc){
    Roles.addUsersToRoles(doc._id, ['customer']);
  });
}


Pages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    perPage: 5
});

RecommendationPages = new Meteor.Pagination(Recommendations, {
    itemTemplate: "product",
    perPage: 5
});
console.log("Paginación habilitada");
