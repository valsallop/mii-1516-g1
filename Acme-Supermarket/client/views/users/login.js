Template.login.events({
	'submit form': function(event){
		event.preventDefault();
		var email = $('[name=email]').val();
		var password = $('[name=password]').val();
		Meteor.loginWithPassword(email, password, function(error){
			if(error){
				bootbox.alert(TAPi18n.__("error_logIn2", lang_tag=null));
			}
		});
	}
});