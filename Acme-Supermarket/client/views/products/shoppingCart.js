Template.shoppingCart.helpers({
  item: function() {
  	var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
  	var items= cart.items;
  	for (i = 0; i < items.length; i++) { 
      var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
      items[i].name=dbItem.name;
      items[i].cost=dbItem.cost;
      items[i].image=dbItem.image;
      items[i].total=parseFloat(items[i].amount*items[i].cost).toFixed(2);;
    }
    return items;
  },
  shoppingCart: function() {
    return ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
  },
  userPressedSig: function(){
    return Session.get('recommendation');

  },
  sessionfalse: function(){
    Session.set('recommendation', false)
  }

});

Template.recommenderCarousel.helpers({
  isItem1: function(){
    res = false
    if (Session.get('recommendationsShopping').length>0){
      res = true
    }
    return res
  },
  isItem2: function(){
    res = false
    if (Session.get('recommendationsShopping').length>4){
      res = true
    }
    return res
  },
  isItem3: function(){
    res = false
    if (Session.get('recommendationsShopping').length>8){
      res = true
    }
    return res
  },
  isItem4: function(){
    res = false
    if (Session.get('recommendationsShopping').length>12){
      res = true
    }
    return res
  },
  recomendations1: function(){
    var response = Session.get('recommendationsShopping');
    var items = []
    if (response.length >= 4){
      for (i = 0; i < 4; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 0; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }

    return items
  },
  recomendations2: function(){
    var response = Session.get('recommendationsShopping');
    var items = []

    if (response.length >= 8){
      for (i = 4; i < 8; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 4; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }

    return items
  },
  recomendations3: function(){
    var response = Session.get('recommendationsShopping');
    var items = []

    if (response.length >= 12){
      for (i = 8; i < 12; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 8; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }
    return items
  },
  recomendations4: function(){
    var response = Session.get('recommendationsShopping');
    var items = []

    if (response.length >= 16){
      for (i = 12; i < 16; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 12; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }
    return items
  }
});

Template.shoppingCart.events({
  'click .idConfirmCart': function(){
    if(Meteor.userId()){
          // var t=TAPi18n.__("toastr_addCart", lang_tag=null);
          // Meteor.call('confirmCart');
          
      Meteor.call('checkUser', Meteor.userId(), function(error, response) {
        if(response){
          var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
          var items= cart.items;
          if(items.length>0){
            var totalCost=0.0;
            for (i = 0; i < items.length; i++) {
              var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
              totalCost=totalCost+(items[i].amount*dbItem.cost);
            }
            totalCost=parseFloat(totalCost).toFixed(2);
            bootbox.confirm(TAPi18n.__("confirmOrder", lang_tag=null)
              +totalCost+TAPi18n.__("confirmOrder2", lang_tag=null)+"</br>"+
              Meteor.user().name+" "+Meteor.user().surname+"</br>"+
              Meteor.user().address.postalCode+"</br>"+
              Meteor.user().address.name+"  n: "+
              Meteor.user().address.number, function(result) {
              if(result){
                bootbox.prompt({
                  title: "Confirm credit card number",
                  value: Meteor.user().creditCard.number,
                  callback: function(result) {
                    if (result === null) {
                    } else {
                      Meteor.call('verifyCCNumber', result, function(error, res) {
                        if(!error){
                          Meteor.call('confirmCart');
                          Router.go('home');
                        }
                        else{
                          bootbox.alert(TAPi18n.__("error_CCverification", lang_tag=null));
                        }
                      });
                    }
                  }
                });
              }
            }); 
          } 
          else {
            bootbox.alert(TAPi18n.__("emptyCart", lang_tag=null));
          }
        }
        else{
          bootbox.alert(TAPi18n.__("error_profileDate", lang_tag=null), function() {
            Router.go('/updateProfile');
            $('.modal-backdrop').remove();
          });
        }
        
      });
    }else{
      var t=TAPi18n.__("toastr_anon", lang_tag=null);
      toastr.error(t);
    }
  },
  'click .recommender': function(){
    Session.set('recommendation', true);
    Session.get('recommendation');

    var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
    var codes = [];
    
    for (i = 0; i < cart.items.length; i++) {
      codes.push(cart.items[i].productCode);
    }

    //var test = [2,3,4,5,6,7,8,9,10,11,12];
    Meteor.call('shoppingRecommender', function(err, data) {
      if (err){
        console.log(err);
      }
      Session.set('recommendationsShopping', data);
    });
    //Session.set('recommendationsShopping', test);
  }

});

Template.recommenderProduct.events({
  'click .idAddCart': function(){
        if(Meteor.userId()){
          var t=TAPi18n.__("toastr_addCart", lang_tag=null);
          Meteor.call('addToCart',this.code);
          toastr.success(t);
        }else{
          var t=TAPi18n.__("toastr_anon", lang_tag=null);
          toastr.error(t);
        }
    }
});

Template.shoppingCartItem.events({
  'click .idDeleteItem': function(){
    Meteor.call('deleteFromCart',this.productCode);
  },
  'click .minusAmount': function(){
    Meteor.call('minusAmount',this.productCode);
  },
  'click .addAmount': function(){
    Meteor.call('addAmount',this.productCode);
  }
});

Template.recommenderProduct.rendered = function () {
  this.$('.rateit').rateit();
}
