Template.updateProfile.events({
	'submit form': function(event){
		 var title=TAPi18n.__("toast_UpdateProfile", lang_tag=null);
    	var message=TAPi18n.__("toast_UpdatedProfile", lang_tag=null);
    	toastr.success(message,title);
	}
});