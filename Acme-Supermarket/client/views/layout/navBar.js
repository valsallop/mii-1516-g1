Template.navBar.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        bootbox.alert(TAPi18n.__("logout2", lang_tag=null), function() {
                Router.go('/');
                $('.modal-backdrop').remove();
        });
        
    }
});