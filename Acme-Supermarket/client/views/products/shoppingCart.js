Template.shoppingCart.helpers({
  shoppingCart: function() {
    return ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
  }
});