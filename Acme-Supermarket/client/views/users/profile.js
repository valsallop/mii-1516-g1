AutoForm.addHooks(['updateProfileData'], {
    onSuccess: function(formType, result) {
    	bootbox.alert(TAPi18n.__("profile_updated", lang_tag=null));
    },
   	onError: function(formType, error) {
     	bootbox.alert(TAPi18n.__(error.message, lang_tag=null));
    }
});

var commentsHooks = {
  before: {
    insert: function(doc) {
      if(Meteor.userId()){
        doc.userId = Meteor.userId();
        doc.supplierId = Router.current().params.id;
		    doc.userEmail = Meteor.users.find({_id:Meteor.userId()}).fetch()[0].emails[0].address;
        return doc;
      }
    }
  }
};

AutoForm.addHooks('insertSupplierComments', commentsHooks);

Template.getProfile.helpers({
  userDetails: function() {
    return Meteor.users.find({_id:Router.current().params.id}).fetch();
  },
  comments: function() {
    return SupplierComments.find({supplierId:Router.current().params.id});
  }
});

Template.userDetail.helpers({
  rating:function(){
    Meteor.call('avgSupplier',Router.current().params.id, function(error, result){
      if(error){
        console.log(error.reason);
      }else{
        Session.set('result', result);
        return result;
      }
    });
    return Session.get('result');
  }
});

Template.userDetail.rendered = function () {
  this.$('.rateit').rateit();
}