Schema = {};

Schema.address = new SimpleSchema({
    name: {
        type: String,
        optional:true 
    },
    number: {
        type: String,
        max:4,
        optional:true        
    },
    postalCode: {
        type: String,
        regEx: /^[0-9]{5}$/,
        optional:true 
    }
});

Schema.creditCard = new SimpleSchema({
    number: {
        type: String,
        optional:true 
    },
    CVV: {
        type: Number,
        min: 100,
        max:999,
        optional:true 
    },
    expMonth: {
        type: Number,
        min:1,
        max:12,
        optional:true 
    },
    expYear: {
        type: Number,
        min:2016,
        max:2030,
        optional:true 
    }
});

Schema.profileData = new SimpleSchema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    address: {
        type: Schema.address,
        optional:true 
    },
    creditCard: {
        type: Schema.creditCard,
        optional:true 
    }
});


if(Meteor.isClient){
    Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password,
        }, function(error){
            console.log(error);
        });
        Meteor.call('sendEmail',
            email,
            "noReply@AcmeSuperMarket.com",
            'Hello from Meteor!',
            'This is a test of Email.send.');
        FlowRouter.go('home');
    }
    });
}
