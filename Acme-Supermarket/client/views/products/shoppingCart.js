Template.shoppingCart.helpers({
  shoppingCart: function() {
    return ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
  }
});
Template.shoppingCart.events({
'click .idConfirmCart': function(){
        if(Meteor.userId()){
          var t=TAPi18n.__("toastr_addCart", lang_tag=null);
          console.log("clicked");
          Meteor.call('confirmCart');
        }else{
          var t=TAPi18n.__("toastr_anon", lang_tag=null);
          toastr.error(t);
        }
   }
});