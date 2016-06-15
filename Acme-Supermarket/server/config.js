Meteor.startup(function () {
 process.env.MAIL_URL = 'smtp://meteor@sandboxd8c0ad0d7ac14d22a31dcfdb187acaf9.mailgun.org:meteor@smtp.mailgun.org:587',
 process.env.CLUSTER_WORKERS_COUNT='auto',
 process.env.CLUSTER_SERVICE='web',
process.env.CLUSTER_ENDPOINT_URL='http://localhost:3000'});

Meteor.methods({
  avgRating: function(proid){
    if(Meteor.isServer){
      var idstr = proid._str;
      var pipeline = [
        {$match : {proId: idstr}},
        {$group: {_id: "$proId", avg: {$avg: "$rating"}}}
      ];
      Ratings.aggregate(pipeline);
      Products.update({_id:proid}, {$set: {rating: parseFloat(result[0].avg)}});
    }
  },
  avgSupplier: function(idSup){
    var pipeline = [
      {$match : {supplierId: idSup}},
      {$group: {_id: "$supplierId", avg: {$avg: "$rating"}}}
    ];
    var result = Products.aggregate(pipeline);
    return parseFloat(result[0].avg);
  },
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
    var email = new Mailgun(options);
    email.send({
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
  createSupplier: function(doc){
    console.log(doc);
    var bcrypt = NpmModuleBcrypt;
    var hash = bcrypt.hashSync(doc.password,10);
    
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
        Accounts.createUser({
            email: doc.email,
            password: doc.password });
        var user= Meteor.users.findOne({"emails.address":doc.email});
        console.log(user);
        Meteor.users.update(user._id, {
          $set: { name: doc.name,
            surname: doc.surname,
            address:{name: doc.address.name,number:doc.address.number,postalCode:doc.address.postalCode},
            coordinates:{lat:location.lat,lon:location.lng},
            roles:["supplier"]
          },$unset: { creditCard: 1 }   
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
  verifyCCNumber: function (number){
    var bcrypt = NpmModuleBcrypt;
    var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
    console.log(number);
    console.log(Meteor.user().creditCard.hashed);

    console.log(bcrypt.compareSync(number, Meteor.user().creditCard.hashed));
    if(!bcrypt.compareSync(number, Meteor.user().creditCard.hashed)){
      throw new Meteor.Error('VerificationFailed');
    }
  },
  updateProfile: function (doc) {
    
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
        if(Roles.userIsInRole(Meteor.userId(), ['customer', 'admin'])){
          var bcrypt = NpmModuleBcrypt;
          var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
          var hash = bcrypt.hashSync(doc.creditCard.number,10);
          Meteor.users.update(Meteor.userId(), {
            $set: { name: doc.name,
              surname: doc.surname,
              address:{name: doc.address.name,number:doc.address.number,postalCode:doc.address.postalCode},
              creditCard:{number:"**** **** **** "+doc.creditCard.number.substring(doc.creditCard.number.length-4, doc.creditCard.number.length),CVV:doc.creditCard.CVV,expMonth:doc.creditCard.expMonth,expYear:doc.creditCard.expYear, hashed:hash},
              coordinates:{lat:location.lat,lon:location.lng}
            }   
          });
        }
        if(Roles.userIsInRole(Meteor.userId(), ['supplier'])){
          Meteor.users.update(Meteor.userId(), {
            $set: { name: doc.name,
              surname: doc.surname,
              address:{name: doc.address.name,number:doc.address.number,postalCode:doc.address.postalCode},
              coordinates:{lat:location.lat,lon:location.lng}
            }   
          });
        }
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
      var itemsHTML="";
      SSR.compileTemplate('emailText', Assets.getText('test.html'));
      
      var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
      var items= cart.items;
      totalCost=0.0;
      for (i = 0; i < items.length; i++) {
        var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
        totalCost=totalCost+(items[i].amount*dbItem.cost);
        itemsHTML=itemsHTML+SSR.render("emailText",{name: dbItem.name,cost:dbItem.cost,
                                          image:dbItem.image,
                                          total:parseFloat(items[i].amount*dbItem.cost).toFixed(2),
                                          amount:items[i].amount})
      }
      totalCost=parseFloat(totalCost).toFixed(2);
      html=html+TAPi18n.__("emailConfirmOrder1", lang_tag=null)+" "+totalCost +"€ ";
      html=html+TAPi18n.__("emailConfirmOrder2", lang_tag=null)+"<br><hr>";
      html=html+itemsHTML;
      html=html+"<hr><br>"+TAPi18n.__("emailConfirmOrder3", lang_tag=null)+"</body></html>"
      console.log(html);

      Meteor.call('sendEmail',
                    Meteor.user().emails[0].address,
                    "confirmOrder@AcmeSuperMarket.com",
                    TAPi18n.__("emailConfirmOrder4", lang_tag=null),
                    '',
                    html);

      ShoppingCarts.update(cart._id, {
        $set: { active:false, deliveryDate: new Date(), paymentDate: new Date(), 
        userName: Meteor.user().name+" "+Meteor.user().surname,
        deliveryAddress: Meteor.user().address.name+", "+Meteor.user().address.number+", "+Meteor.user().address.postalCode }   
      });
      ShoppingCarts.insert({
        "userId" : Meteor.userId(),
        "items" : [],
        "active" : true,
        "deliveryDate" : null,
        "paymentDate" : null,
        "userName":null,
        "deliveryAddress":null
      });
    }
  },


  shoppingRecommender: function(){
    var productRecommended = [];
    var rules = ShoppingCartsRules.find({}, {sort: {ts_process: -1}});
    var firstRule=ShoppingCartsRules.findOne({}, {sort: {ts_process: -1}});
    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});

    var codesCart=[];
    for (var i =0;i<cart.items.length;i++){
      codesCart.push(cart.items[i].productCode);
    }
    
    var date = firstRule.ts_process;
    rules.forEach(function (rule) {
      if(rule.ts_process.toString() == date.toString()){
        for(var x = 0; x<codesCart.length; x++){
          var purchased = rule.purchasedProduct;
          for(var y = 0; y<purchased.length; y++){
            if(codesCart[x] == purchased[y]){
              productRecommended.push(rule.recommendedProduct);
            }
          }
        }
      }
    });
    
    //lo convertimos en una misma lista
    var productRecommended2 = [];
    for (var j=0; j<productRecommended.length; j++){
      for(var k=0; k<productRecommended[j].length; k++){
        productRecommended2.push(productRecommended[j][k]);
      }  
    }

    var productRecommended3 = [];
    var productRecommended3 = productRecommended2.filter(function(elem, pos) {
       return productRecommended2.indexOf(elem) == pos;
    });
    
    //eliminamos los objetos que tenemos en el carrito
    /*
    var auxRecommended = [];
    for (var a = 0; productRecommended3.length; a++){
      if (codesCart.indexOf(productRecommended3[a]) == -1){
        auxRecommended.push(productRecommended3[a]);
      }
    }*/

    var productRecommended4 = [];
    if(productRecommended3.length>15){
      for(var l=0;l<16;l++){
        productRecommended4[l] = productRecommended3[l];
      }
    }else{
      productRecommended4 = productRecommended3;
    }
    console.log(productRecommended4);
    return productRecommended4;
  },
//BUSQUEDA DE BARCODE Y STRING

  addStickToCart: function (user,code) {
    var cart=ShoppingCarts.findOne({ active:true , userId:user});
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

  searchString: function (cadena) {
    if (cadena.indexOf("%20") > -1){
      var cadaux = cadena.split("%20");
    }else{
      var cadaux = cadena.split(" ");
    }
    
    if (cadaux.length > 3){
      var cad = cadaux.slice(0, 3);
    }else{
      var cad = cadaux.slice(0);
    }
    var items = [];
    var itemsCode = [];
    var itemFilter = [];
    for (var l=0;l<cad.length;l++){
      var itemsAux = Products.find({"name" : {$regex : ".*"+cad[l]+".*",$options:"i"}}).fetch();
      if (itemsAux.length>0){
        for (var i = 0; i<itemsAux.length;i++){
          if (itemsCode.indexOf(itemsAux[i].code) < 0){
            itemsCode.push(itemsAux[i].code)
            items.push(itemsAux[i])
          }
        }
      }
    }
    if (items.length>0){
      for (var j=0;j<items.length;j++){
        var cont = 0;
        var nameLower = items[j].name.toLowerCase().split(" ");

        for (var k=0;k<nameLower.length;k++){
          for (var n=0;n<cad.length;n++){
            if (nameLower[k] == cad[n].toLowerCase()){
              cont++;
            }
          }
        }
        if (cont == cad.length){
          //Meteor.call('addToCart',items[j].code)
          itemFilter.push(items[j]); 
        }
      }
    }
    
    if (itemFilter.length == 0) {
      console.log('No se han encontrado coincidencias');
    } else {
      console.log('Enviado');
    }
    return itemFilter;
  },

  //check password
  checkPassword: function(digest,user) {
    check(digest, String);
    var password = {digest: digest, algorithm: 'sha-256'};
    var result = Accounts._checkPassword(user, password);
    console.log(result.error)
    return result.error == null;
  }
});



//Configuracion de la api

if (Meteor.isServer) {
  Meteor.startup(function () {

    //Metodo Get para traer todos los producto con una cadena

    //localhost:3000/stick/nivea%20crema

    Picker.route('/stick/:_id', function(params, req, res, next) {
      var items = Meteor.call('searchString',params._id);
      res.end(JSON.stringify(items));
    });

    //localhost:3000/stickCode/640522710515
    Picker.route('/stickCode/:_id', function(params, req, res, next) {
      var item = Products.findOne({code:parseInt(params._id)});
      if (item == null){
        console.log('Objeto no encontrado');
        item = [];
      }
      res.end(JSON.stringify(item));
    });

    /*
    {
      useremail:sertrimur@gmail.com
      stickcode:2
      amountcode:3
    }

    */

    Picker.route('/sendproduct', function(params, req, res, next) {
      //console.log(req);
      console.log(req.headers.useremail);
      console.log(req.headers.stickcode);
      console.log(req.headers.amountcode);

      var email = req.headers.useremail.toString();

      var user = Meteor.users.find({emails:[{address:email,verified:false}]}).fetch();

      var amount = parseInt(req.headers.amountcode);
      var code = parseInt(req.headers.stickcode);

      for(var j = 0;j<amount;j++){
          Meteor.call('addStickToCart',user[0]._id,code);
        }
    });

    /*
    {
      useremail:sertrimur@gmail.com
      password:admin
    }

    */

    //Post comprobacion de usuario
    Picker.route('/autenticateuser', function(params, req, res, next) {
      //console.log(req);
      console.log(req.headers.useremail);
      console.log(req.headers.password);

      var bcrypt = NpmModuleBcrypt;
      var bcryptHash = Meteor.wrapAsync(bcrypt.hash);
      var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
      Accounts._bcryptRounds = 10;

      var user = Meteor.users.find({emails:[{address:req.headers.useremail.toString(),verified:false}]}).fetch();

      var getPasswordString = function (password) {
        if (typeof password === "string") {
          password = Package.sha.SHA256(password);;
        } else { // 'password' is an object
          if (password.algorithm !== "sha-256") {
            throw new Error("Invalid password hash algorithm. " +
                            "Only 'sha-256' is allowed.");
          }
          password = password.digest;
        }
        return password;
      };

      var hashPassword = function (password) {
        password = getPasswordString(password);
        return bcryptHash(password, Accounts._bcryptRounds);
      };

      Accounts._checkPassword = function (user, password) {
        var result = {
          userId: user._id
        };

        password = getPasswordString(password);

        if (! bcryptCompare(password, user.services.password.bcrypt)) {
          result.error = new Meteor.Error(403, "Incorrect password");
        }

        return result;
      };
      var checkPassword = Accounts._checkPassword(user[0],req.headers.password.toString());
      console.log(checkPassword.error == null);

      if (checkPassword.error == null) {
          console.log('the passwords match!');
          res.end('the passwords match!');
      }else{
          console.log('the passwords no match!');
          res.end('the passwords no match!');
      }
    });

    /*
    {
      useremail:sertrimur@gmail.com
      password:admin
    }

    */

    Picker.route('/stickShoppingCarts', function(params, req, res, next) {
      
      var user = Meteor.users.find({emails:[{address:req.headers.useremail.toString(),verified:false}]}).fetch();
      var shoppingCarts = ShoppingCarts.find({userId:user[0]._id,active:true}).fetch();
      res.end(JSON.stringify(shoppingCarts[0]));
    });

    

    //Metodo Post para introducir varios productos en coleccion shoppingCarts
    /*
    {
      useremail: sertrimur@gmail.com
      stickcode:[1,3,2]
      amountcode: [1,2,3]
    }

    */
    Picker.route('/sendstick', function(params, req, res, next) {
      //console.log(req);
      console.log(req.headers.useremail);
      console.log(req.headers.stickcode);
      console.log(req.headers.amountcode);
      var user = Meteor.users.find({emails:[{address:req.headers.useremail.toString(),verified:false}]}).fetch();

      var arrayCode = req.headers.stickcode.slice(1,req.headers.stickcode.length-1).split(",");
      var arrayAmountCode = req.headers.amountcode.slice(1,req.headers.amountcode.length-1).split(",");
      for (var i = 0; i<arrayCode.length;i++){
        console.log(parseInt(arrayCode[i]));
        for(var j = 0;j<arrayAmountCode[i];j++){
          Meteor.call('addStickToCart',user[0]._id,parseInt(arrayCode[i]));
        }
      }
    });
    

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

    collectionApi.addCollection(ShoppingCarts, 'shoppingCarts', {
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

    collectionApi.addCollection(Ratings, 'ratings', {
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