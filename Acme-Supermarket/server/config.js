Meteor.startup(function () {
 process.env.MAIL_URL = 'smtp://meteor@sandboxd8c0ad0d7ac14d22a31dcfdb187acaf9.mailgun.org:meteor@smtp.mailgun.org:587',
 process.env.CLUSTER_WORKERS_COUNT='auto',
 process.env.CLUSTER_SERVICE='web',
process.env.CLUSTER_ENDPOINT_URL='http://localhost:3000'});

Meteor.methods({
  sendEmail: function (to, from, subject, text, html) {
    check([to, from, subject, text], [String]);
    console.log("----------");
    console.log(to);
    console.log("----------");
    console.log(from);
    console.log("----------");
    console.log(subject);
    console.log("----------");
    console.log(text);
    console.log("----------");
    console.log(html);
    console.log("----------");
    // // Let other method calls from the same client start running,
    // // without waiting for the email sending to complete.
    this.unblock();
    var options = {
      apiKey: 'key-a0c3771b726e77f92a25b60f0d2c68e8',
      domain: 'sandboxd8c0ad0d7ac14d22a31dcfdb187acaf9.mailgun.org'
    }
    var NigerianPrinceGun = new Mailgun(options);
    NigerianPrinceGun.send({
     'to': to,
     'from': from,
     'html': html,
     'text': text,
     'subject': subject,
     'tags': [
     'AcmeSuperMarket',
     'test',
     'tags'
     ]
    });

  },
  verifyCCNumber: function (number){
    var bcrypt = NpmModuleBcrypt;
    var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
    bcrypt.compare(number, Meteor.user().creditCard.hashed, function(err, res) {
      if(res===true){
        return true;
      }
      else{
        return false;
      }
    });
  },
  updateProfile: function (doc) {
    var bcrypt = NpmModuleBcrypt;
    var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
    var hash = bcrypt.hashSync(doc.creditCard.number,10);
    
    var result = HTTP.call('GET', 'http://maps.google.com/maps/api/geocode/json?address='
      +doc.address.name+',+Spain,+'+
      doc.address.postalCode+'+&sensor=false');
    
    var content=EJSON.parse(result.content);
    
    for (var i = 0; i < content.results.length; i++) {
      var checkAddress=false;
      var checkPostalCode=false;
      
      for(var j=0; j<content.results[i].address_components.length;j++){
        if(content.results[i].address_components[j].types.indexOf('route')!=-1){
          checkAddress=true;
        }
        if(content.results[i].address_components[j].types.indexOf('postal_code')!=-1){
          if(content.results[i].address_components[j].long_name===doc.address.postalCode){
            checkPostalCode=true;
          }
        }
      }
      if(checkAddress&&checkPostalCode){
        var location=content.results[i].geometry.location;
        Meteor.users.update(Meteor.userId(), {
          $set: { name: doc.name,
            surname: doc.surname,
            address:{name: doc.address.name,number:doc.address.number,postalCode:doc.address.postalCode},
            creditCard:{number:"**** **** **** "+doc.creditCard.number.substring(doc.creditCard.number.length-4, doc.creditCard.number.length),CVV:doc.creditCard.CVV,expMonth:doc.creditCard.expMonth,expYear:doc.creditCard.expYear, hashed:hash},
            coordinates:{lat:location.lat,lon:location.lng}
          }   
        });
        break;
      }
    }
    if(!checkAddress){
      throw new Meteor.Error('NoAddressFound');
    }
    if(!checkPostalCode){
      throw new Meteor.Error('InvalidPostalCode');
    }
  },
  checkUser: function (userId) {
    if(Meteor.userId()==userId && Meteor.user().address.name!=null
      && Meteor.user().address.postalCode!=null){
      if(Meteor.user().creditCard.number!=null && Meteor.user().creditCard.CVV>100 && Meteor.user().creditCard.CVV<=999
        && ((Meteor.user().creditCard.expYear==new Date().getFullYear() && Meteor.user().creditCard.expMonth>=(new Date().getMonth()+1))
          ||(Meteor.user().creditCard.expYear>=new Date().getFullYear() && Meteor.user().creditCard.expMonth>=0))){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  },
  checkEmptyCart: function (userId) {
    if(Meteor.userId()==userId){
      var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
      if(cart.items.length>0){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  },
  addToCart: function (code) {
    console.log(Meteor.userId());
    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
    for (var i = 0; i < cart.items.length; i++) {
      var exist=false;
      if(cart.items[i].productCode==code){
        exist=true;
        cart.items[i].amount=cart.items[i].amount+1;
        break;
      }
    }
    console.log("exist:"+exist);
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
      var html = Assets.getText('headerTemplate.html');
      SSR.compileTemplate('emailText', Assets.getText('test.html'));
      html=html+"Acaba de realizar un pedido con los siguientes productos:<br><hr>";
      var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
      var items= cart.items;
      for (i = 0; i < items.length; i++) {
        var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
        html=html+SSR.render("emailText",{name: dbItem.name,cost:dbItem.cost,
                                          image:dbItem.image,
                                          total:parseFloat(items[i].amount*dbItem.cost).toFixed(2),
                                          amount:items[i].amount})
      }
      html=html+"<hr><br>Gracias por confiar en Acme-supermarket</body></html>"
      console.log(html);

      Meteor.call('sendEmail',
                    Meteor.user().emails[0].address,
                    "confirmOrder@AcmeSuperMarket.com",
                    'New order',
                    '',
                    html);

      ShoppingCarts.update(cart._id, {
        $set: { active:false, deliveryDate: new Date(), paymentDate: new Date() }   
      });
      ShoppingCarts.insert({
        "userId" : Meteor.userId(),
        "items" : [],
        "active" : true,
        "deliveryDate" : null,
        "paymentDate" : null
      });
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