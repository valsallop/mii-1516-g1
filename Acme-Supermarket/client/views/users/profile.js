AutoForm.addHooks(['updateProfileData'], {
    onSuccess: function(formType, result) {
    	bootbox.alert(TAPi18n.__("profile_updated", lang_tag=null));
    },
   	onError: function(formType, error) {
     	bootbox.alert(TAPi18n.__(error.message, lang_tag=null));
    }
});