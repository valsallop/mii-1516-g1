Template.shoppingCart.helpers({
  item: function() {
  	var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
  	var items= cart.items;
  	for (i = 0; i < items.length; i++) { 
     var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
     items[i].name=dbItem.name;
     items[i].cost=dbItem.cost;
     items[i].image=dbItem.image;
     items[i].total=parseFloat(items[i].amount*items[i].cost).toPrecision(4);
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
                totalCost=parseFloat(totalCost).toPrecision(4);
                bootbox.confirm("El pedido por valor de "+totalCost+"€ se enviará a la direccion: "+Meteor.user().address.name+","+Meteor.user().address.number, function(result) {
                  console.log(result);
                  if(result){
                    Meteor.call('confirmCart');
                  }
                }); 
              } 
              else {
                bootbox.alert("El carrito esta vacío");
              }
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