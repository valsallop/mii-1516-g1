Template.shoppingCart.helpers({
  item: function() {
  	var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
  	var items= cart.items;
  	for (i = 0; i < items.length; i++) { 
    	var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
    	items[i].name=dbItem.name;
    	items[i].cost=dbItem.cost;
    	items[i].image=dbItem.image;
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
          var t=TAPi18n.__("toastr_addCart", lang_tag=null);
          Meteor.call('confirmCart');
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
   'onfocus,onchange .itemAmount': function(){
        console.log(this.amount);
        console.log("TEST");
   }
});