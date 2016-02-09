if (process.env.IS_MIRROR) {
  Meteor.methods({
    loadFixtures: function(){
      console.log('Loading default fixtures');
        // TODO: add your fixtures here
        // Accounts.createUser({
        //   email: 'email@example.com',
        //   password: '123456'
        // });
      Products.insert(
        {
          name : "GILLETE FUSION PROGLIDE recambio de maquinilla manual 5 hojas estuche 3 uds",
          cost : 13.3,
          description : "",
          image : "http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8MjYyODF8aW1hZ2UvcG5nfGhkNS9oYjEvODgzNDc3NjAzOTQ1NC5wbmd8MGE2YTAyNDNkM2E2MGIxMzk5MzY4NTdiZTkwMjM2MmYzMTFlZGYxNDZmN2MwNzM4ZGE2OTJlNGJkYzdhODU1MA.png",
          code : 1,
          rating : 3.5,
          availability : 1,
          supplierId: 'w4QCby6QvKQuhFRTG',
          tags:['Test','create', 'Product']
        }
      );
      Products.insert(
        {
          name : "NIVEA desodorante dry comfort unisex spray 200ml",
          cost : 3.35,
          description: "",
          image: "http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8NjIzMHxpbWFnZS9wbmd8aDEzL2g1OC84ODMzNjM0MDA5MTE4LnBuZ3xkYzI5N2YyZDg0ZmU5OWNkMWI3OTU1ZTUwNzdiOGY2ZDRjNmQ4MjY1OThkMTE2ODRiZTM4MTE3MjA4ZTY3ODE0.png",
          code : 2,
          rating: 4,
          availability : 1,
          supplierId: 'w4QCby6QvKQuhFRTG',
          tags:['Test','create', 'Product']
        }
      );
      console.log('Finished loading default fixtures');
    },

    clearDB: function(){
      console.log('Clear DB');

      var collectionsRemoved = 0;
      var db = Meteor.users.find()._mongo.db;
      db.collections(function (err, collections) {

        var appCollections = _.reject(collections, function (col) {
          return col.collectionName.indexOf('velocity') === 0 ||
          col.collectionName === 'system.indexes';
        });

        _.each(appCollections, function (appCollection) {
          appCollection.remove(function (e) {
            if (e) {
              console.error('Failed removing collection', e);
              fut.return('fail: ' + e);
            }
            collectionsRemoved++;
            console.log('Removed collection');
            if (appCollections.length === collectionsRemoved) {
              console.log('Finished resetting database');
            }
          });
        });

      });

      console.log('Finished clearing');
    },
    createAdmin: function(){
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
          Roles.addUsersToRoles(doc._id, ['admin']);
          return doc._id;
        });
      }
    },
    createObj: function (uId) {
      if(Meteor.isServer){
        Products.insert({
          name : "Test create",
          cost : 3.35,
          description : "Test create",
          image : "",
          code : 25,
          rating : 4,
          availability : 1,
          supplierId: uId,
          tags:['Test','create', 'Product']
        });
        Comments.insert({
          codePro:25,
          userId: uId,
          userEmail:"customer@customer.com",
          title: "Test comment",
          description:"Create comment"
        });
          console.log('---------Create Logs-----------');
          console.log(Products.find({code:25}).fetch());
          console.log(Comments.find({codePro:25}).fetch());
          console.log(ShoppingCarts.find({userId:uId}).fetch());
      }
      
    },
    updateObj: function(uId) {
      if(Meteor.isServer){

        //Update product
        Products.update({code:25},{$set:
        {
          name : "Test update",
          cost : 5,
          description : "Test update",
          image : "",
          code : 25,
          rating : 2.5,
          availability : 1,
          supplierId: uId,
          tags:['Test','create', 'Product']
        }});
      
        //Update Comment
        Comments.update({codePro:25},{$set:
        {
          userEmail: 'admin@admin.com',
          title: 'Test update comment',
          description: 'Update comment'
        }});
        

        //Update ShoppingCart añade un producto al carrito y lo confirma
        var cart=ShoppingCarts.findOne({ active:true , userId:uId});
        var item={
           "productCode" : 25,
           "amount" : 1
        };
        cart.items.push(item);
        ShoppingCarts.update(cart._id, {
            $set: { items: cart.items, active:false, deliveryDate: new Date(), paymentDate: new Date()}   
        });
        ShoppingCarts.insert({userId : uId,items : [],active : true,deliveryDate : null,paymentDate : null});

        Meteor.users.update(uId,{$set:{name: 'Sergio',surname: 'Trigos',address: { name: 'Reina Mercedes', number: '45', postalCode: '41012' }}});

        console.log('---------Update Logs-----------');
        console.log(Products.find({code:25}).fetch());
        console.log(Comments.find({codePro:25}).fetch());
        console.log(ShoppingCarts.find({userId:uId}).fetch());
        console.log(Meteor.users.find({_id:uId}).fetch());
      }
    },
    removeObj: function(uId) {
      if(Meteor.isServer){
        //Remove product
        Products.remove({code:25});
      
        //Remove Comment
        Comments.remove({codePro:25});

        //Remove ShoppingCart
        ShoppingCarts.remove({active:false , userId:uId});

        //Remove User
        Meteor.users.remove({_id:uId});

        console.log('---------Remove Logs-----------');
        if(Products.find().count() == 0){
          console.log('Remove product');
        }
        if(Comments.find().count() == 0){
          console.log('Remove comment');
        }
        if(ShoppingCarts.find().count() == 1){
          console.log('Remove shopping cart');
        }
        if(Meteor.users.find().count() == 0){
          console.log('Remove user');
        }
      }
        
    }
});
}