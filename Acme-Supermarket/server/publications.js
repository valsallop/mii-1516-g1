Meteor.publish('products', function() {
  return Products.find();
});

Meteor.publish('tags', function() {
  return Tags.find();
});

Meteor.publish('comments', function() {
  return Comments.find();
});

Meteor.publish('supplierComments', function() {
  return SupplierComments.find();
});

Meteor.publish('ratings', function() {
  return Ratings.find();
});

Meteor.publish('shoppingCarts', function() {
  return ShoppingCarts.find();
});


Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({$or: [ { roles: 'supplier' }, { _id: this.userId }]},{fields: {'emails':1,'name': 1, 'surname': 1,'address': 1,'creditCard':1}});
  
  } else {
    
    this.ready();
  }
});


Ratings.allow({
  insert: function() {
    return true;
  }
});

Meteor.users.permit('update').ifHasRole('admin').exceptProps(['roles', 'services']).apply();
Meteor.users.permit('update').ifHasUserId(this.userId).exceptProps(['roles', 'services']).apply();
Meteor.users.permit(['insert']).apply();
Products.permit(['insert','update','remove']).ifHasRole('admin').apply();
Products.permit(['insert']).ifHasRole('supplier').apply();
Comments.permit(['insert','update','remove']).ifHasRole('admin').apply();
Comments.permit(['insert']).apply();
SupplierComments.permit(['insert','update','remove']).ifHasRole('admin').apply();
SupplierComments.permit(['insert']).apply();
ShoppingCarts.permit(['insert','update','remove']).ifHasRole('admin').apply();
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
  Products.before.insert(function(userId,doc){
    console.log(doc);
    if(doc.name.indexOf("NIVEA")>-1){
      doc.tags.push("Higiene");
    }
  });
  Products.after.insert(function(userId,doc){
    console.log(doc);
    for(var i=0;i<doc.tags.length;i++){
      console.log(doc.tags[i]);
      Tags.insert({tag:doc.tags[i]},{continueOnError: true});
    }
  });
}
AdminConfig = {
  name: 'Acme-Supermarket',
  adminEmails: ['acmesupermarket@gmail.com'],
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
    },
    SupplierComments: {
      icon: 'comment',
      omitFields: ['updatedAt'],
      tableColumns: [
       { label: 'Title', name: 'title' },
       { label: 'Created', name: 'createdAt'},
       { label: 'User', name: 'userEmail'}
      ],
      showEditColumn: true, // Set to false to hide the edit button. True by default.
      showDelColumn: true, // Set to false to hide the edit button. True by default.
      showWidget: true,
      color: 'orange'
    }
  }
};

