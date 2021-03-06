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
        max:16,
        min:16,
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

Schema.supplier = new SimpleSchema({
    email:{
        type:String
    },
    password:{
        type:String
    },
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
});
Schema.supplierProfileData = new SimpleSchema({
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

UsersServices = {
  getUser: function (uId) {
    return Meteor.users.findOne(uId);
  },
  setUser: function (uId){
    Meteor.users.update({_id:uId},{$set:
      {
        name: 'Sergio',
        surname: 'Trigos',
        address: { name: 'Reina Mercedes', number: '45', postalCode: '41012'}
    }});
  },
  usersExist: function (uId) {
    return Meteor.users.find({_id:uId}).count() != 0;
  }
};


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
        // Meteor.call('sendEmail',
        //     email,
        //     "noReply@AcmeSuperMarket.com",
        //     'Hello from Meteor!',
        //     'This is a test of Email.send.');
        Router.go('home');
    }
    });
}

Meteor.startup(function() {
  Schema.profileData.i18n("schemas.profileData");
});


