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
                            console.log("error: "+error)
                            console.log("verify: "+res);
                            if(response){
                              Meteor.call('confirmCart');
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