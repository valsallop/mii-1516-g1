Meteor.startup(function () {
 process.env.MAIL_URL = 'smtp://meteor@sandboxd8c0ad0d7ac14d22a31dcfdb187acaf9.mailgun.org:meteor@smtp.mailgun.org:587';});

Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
  updateProfile: function (doc) {
    Meteor.users.update(Meteor.userId(), {
      $set: { name: doc.name,
        surname: doc.surname,
        address:{name: doc.address.name,number:doc.address.number,postalCode:doc.address.postalCode},
        creditCard:{number:doc.creditCard.number,CVV:doc.creditCard.CVV,expMonth:doc.creditCard.expMonth,expYear:doc.creditCard.expYear}
      }   
    });
  },
  checkUser: function (userId) {
    if(Meteor.userId()==userId && Meteor.user().address.name!=null
      && Meteor.user().address.postalCode!=null){
      console.log(Meteor.user().creditCard.number!=null);
      console.log(Meteor.user().creditCard.CVV>100);
      console.log(Meteor.user().creditCard.CVV<=999);
      console.log((Meteor.user().creditCard.expYear==new Date().getFullYear() && Meteor.user().creditCard.expMonth>=(new Date().getMonth()+1)));
      console.log((Meteor.user().creditCard.expYear>=new Date().getFullYear() && Meteor.user().creditCard.expMonth>=0));
      console.log(((Meteor.user().creditCard.expYear==new Date().getFullYear() && Meteor.user().creditCard.expMonth>=(new Date().getMonth()+1))
          ||(Meteor.user().creditCard.expYear>=new Date().getFullYear() && Meteor.user().creditCard.expMonth>=0)));
      if(Meteor.user().creditCard.number!=null && Meteor.user().creditCard.CVV>100 && Meteor.user().creditCard.CVV<=999
        && ((Meteor.user().creditCard.expYear==new Date().getFullYear() && Meteor.user().creditCard.expMonth>=(new Date().getMonth()+1))
          ||(Meteor.user().creditCard.expYear>=new Date().getFullYear() && Meteor.user().creditCard.expMonth>=0))){
        return true;
      }
    }
    else{
      return false;
    }
  },
  addToCart: function (code) {
    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
    for (var i = 0; i < cart.items.length; i++) {
      var exist=false;
      if(cart.items[i].productCode==code){
        exist=true;
        console.log("si");
        cart.items[i].amount=cart.items[i].amount+1;
        console.log(cart.items[i]);
        console.log("----------------------");
      }
    }
    if(!exist){
      var item={
         "productCode" : code,
         "amount" : 1
      }
      cart.items.push(item);
    }
    ShoppingCarts.update(cart._id, {
        $set: { items: cart.items }   
    });
  },
  deleteFromCart: function (code) {
    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
    for (var i = 0; i < cart.items.length; i++) {
      if(cart.items[i].productCode==code){
        cart.items.splice(i,1);
        break;
      }
    }
    ShoppingCarts.update(cart._id, {
        $set: { items: cart.items }   
    });
  },
  minusAmount: function (code) {
    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
    for (var i = 0; i < cart.items.length; i++) {
      if(cart.items[i].productCode==code){
        cart.items[i].amount=cart.items[i].amount-1;
        if(cart.items.amount==0){
          deleteFromCart(code);
        }
        break;
      }
    }
    ShoppingCarts.update(cart._id, {
        $set: { items: cart.items }   
    });
  },
  addAmount: function (code) {
    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
    for (var i = 0; i < cart.items.length; i++) {
      if(cart.items[i].productCode==code){
        cart.items[i].amount=cart.items[i].amount+1;
        break;
      }
    }
    ShoppingCarts.update(cart._id, {
        $set: { items: cart.items }   
    });
  },
  confirmCart: function () {
    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
    if(cart.items.length>0){
      ShoppingCarts.update(cart._id, {
        $set: { active:false, deliveryDate: new Date(), paymentDate: new Date() }   
      });
      ShoppingCarts.insert({
        "userId" : Meteor.userId(),
        "items" : [],
        "active" : true,
        "deliveryDate" : null,
        "paymentDate" : null
      })
      Router.go('home');
    }
    else{
      Router.go('home');
    }
  }
});

//Configuracion de la api

if (Meteor.isServer) {
  Meteor.startup(function () {

    // All values listed below are default
    collectionApi = new CollectionAPI({
      authToken: undefined,              // Require this string to be passed in on each request
      apiPath: 'collectionapi',          // API path prefix
      standAlone: false,                 // Run as a stand-alone HTTP(S) server
      allowCORS: false,                  // Allow CORS (Cross-Origin Resource Sharing)
      sslEnabled: false,                 // Disable/Enable SSL (stand-alone only)
      listenPort: 3005,                  // Port to listen to (stand-alone only)
      listenHost: undefined,             // Host to bind to (stand-alone only)
      privateKeyFile: 'privatekey.pem',  // SSL private key file (only used if SSL is enabled)
      certificateFile: 'certificate.pem', // SSL certificate key file (only used if SSL is enabled)
      timeOut: 120000
    });

    // Add the collection Players to the API "/players" path
    collectionApi.addCollection(Products, 'products', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request.
      authenticate: undefined, // function(token, method, requestMetadata) {return true/false}; More details can found in [Authenticate Function](#Authenticate-Function).
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection.
                 // If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,    // function(obj, requestMetadata, returnObject) {return true/false;},
        GET: undefined,     // function(objs, requestMetadata, returnObject) {return true/false;},
        PUT: undefined,     // function(obj, newValues, requestMetadata, returnObject) {return true/false;},
        DELETE: undefined   // function(obj, requestMetadata, returnObject) {return true/false;}
      },
      after: {  // This methods, if defined, will be called after the POST/GET/PUT/DELETE actions are performed on the collection.
                // Generally, you don't need this, unless you have global variable to reflect data inside collection.
                // The function doesn't need return value.
        POST: undefined,    // function() {console.log("After POST");},
        GET: undefined,     // function() {console.log("After GET");},
        PUT: undefined,     // function() {console.log("After PUT");},
        DELETE: undefined   // function() {console.log("After DELETE");},
      }
    });

    // Starts the API server
    collectionApi.start();
  });
}