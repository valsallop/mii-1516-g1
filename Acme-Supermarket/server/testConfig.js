if (process.env.IS_MIRROR) {
  Meteor.methods({
    'loadFixtures': function(){
      console.log('Loading default fixtures');
      // TODO: add your fixtures here
      // Accounts.createUser({
      //   email: 'email@example.com',
      //   password: '123456'
      // });
  Products.insert(
    {
      "name" : "GILLETE FUSION PROGLIDE recambio de maquinilla manual 5 hojas estuche 3 uds",
      "cost" : 13.3,
      "description" : "",
      "image" : "http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8MjYyODF8aW1hZ2UvcG5nfGhkNS9oYjEvODgzNDc3NjAzOTQ1NC5wbmd8MGE2YTAyNDNkM2E2MGIxMzk5MzY4NTdiZTkwMjM2MmYzMTFlZGYxNDZmN2MwNzM4ZGE2OTJlNGJkYzdhODU1MA.png",
      "code" : 1,
      "rating" : 3.5,
      "availability" : 1
    }
  );
  Products.insert(
    {
      "name" : "NIVEA desodorante dry comfort unisex spray 200ml",
      "cost" : 3.35,
      "description" : "",
      "image" : "http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8NjIzMHxpbWFnZS9wbmd8aDEzL2g1OC84ODMzNjM0MDA5MTE4LnBuZ3xkYzI5N2YyZDg0ZmU5OWNkMWI3OTU1ZTUwNzdiOGY2ZDRjNmQ4MjY1OThkMTE2ODRiZTM4MTE3MjA4ZTY3ODE0.png",
      "code" : 2,
      "rating" : 4,
      "availability" : 1
    }
  );
  console.log('Finished loading default fixtures');
},

'clearDB': function(){
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
}
});
}