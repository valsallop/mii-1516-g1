Meteor.publish('products', function() {
  return Products.find();
});

Meteor.publish('comments', function() {
  return Comments.find();
});

Meteor.publish('ratings', function() {
  return Ratings.find();
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

Meteor.publish('shoppingCarts', function() {
  return ShoppingCarts.find();
});


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
ShoppingCarts.permit(['insert','update']).apply();

if(Meteor.isServer){
	Meteor.users.before.insert(function(userId, doc){
    doc.lastLogin=new Date();
    doc.name=null;
    doc.surname=null;
    doc.address={name: null,number:null,postalCode:null};
    doc.coordinates={lat: null, lon:null};
    doc.creditCard={number:null,CVV:null,expMonth:null,expYear:null};
  });
  Meteor.users.after.insert(function(userId, doc){
    Roles.addUsersToRoles(doc._id, ['customer']);
    ShoppingCarts.insert({
      "userId" : doc._id,
      "items" : [],
      "active" : true,
      "orderDate" : null,
      "paymentDate" : null
    })
  });


  
}
AdminConfig = {
  name: 'Acme-Supermarket',
  adminEmails: ['daltonic65@gmail.com'],
  collections: {
    Products: {
        icon: 'gift',
      omitFields: ['updatedAt'],
      tableColumns: [
       { label: 'Code', name: 'code'},
       { label: 'Name', name: 'name' },
       { label: 'Cost(€)', name: 'cost'}
      ],
      showEditColumn: true, // Set to false to hide the edit button. True by default.
      showDelColumn: true, // Set to false to hide the edit button. True by default.
      showWidget: false,
      color: 'red'
    },
    ShoppingCarts:{
        icon: 'shopping-cart',
      tableColumns: [
       { label: 'User ID', name: 'userId'},
       { label: 'State', name: 'active' },
       { label: 'Payment Date', name: 'paymentDate' },
       { label: 'Delivery Date', name: 'deliveryDate'}
      ],
      showEditColumn: true, // Set to false to hide the edit button. True by default.
      showDelColumn: true, // Set to false to hide the edit button. True by default.
      showWidget: false,
      color: 'yellow'
    },
    Comments: {
      icon: 'comment',
      omitFields: ['updatedAt'],
      tableColumns: [
       { label: 'Title', name: 'title' },
       { label: 'Created', name: 'createdAt'},
       { label: 'User', name: 'userEmail'}
      ],
      showEditColumn: true, // Set to false to hide the edit button. True by default.
      showDelColumn: true, // Set to false to hide the edit button. True by default.
      showWidget: false,
      color: 'green'
    }
  }
};
AdminDashboard.addSidebarItem('Analytics', {
  icon: 'line-chart',
  urls: [
    { title: 'Statistics', url: AdminDashboard.path('/analytics/statistics') }
  ]
});

