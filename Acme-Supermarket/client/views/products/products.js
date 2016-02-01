Pages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "products",
    perPage: 4
});

Template.product.events({
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
Template.product.rendered = function () {
  this.$('.rateit').rateit();
}