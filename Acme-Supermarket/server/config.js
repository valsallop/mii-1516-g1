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
    }
  }
});