describe("Backend - Nominal - check user", function() {
    it("setup MongoDB for testing", function () {
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
        });
        Accounts.createUser({email: 'test@test.com',password: '123456'});
        var email='test@test.com';
        var password='123456';
        var doc = {
            name: 'Test',
            surname: 'Test',
            address:{   name: 'C/Test',
                        number: 16,
                        postalCode: 41005},
            creditCard:{
                        number: 4120235645698563,
                        CVV: 156,
                        expMonth: 12,
                        expYear: 2019}
        };
        Meteor.call('updateProfile', doc)

    });
    it("call check user and return true", function () {
        var user={
        _id : "YJsAJX5FvfwaBEQip",
        services : {
                password : {
                        "bcrypt" : "$2a$10$WrBI/dKNblO4MPIJ.fqkre47wh.pf8ULidogjZrIkCwo9ErnG1Gn."
                },
                resume : {
                        loginTokens : [ ]
                }
        },
        emails : [
                {
                        address : "test@test.com",
                        verified : false
                }
        ],
        name : "Test",
        surname : "Test",
        address : {
                name : "15",
                number : "10",
                postalCode : "11520"
        },
        coordinates : {
                lat : null,
                lon : null
        },
        creditCard : {
                number : "4120235645698563",
                CVV : 567,
                expMonth : 12,
                expYear : 2019
        },
        roles : [
                "customer"
        ]};
        spyOn(Meteor, 'user').and.returnValue(user);
        spyOn(Meteor, 'userId').and.returnValue(user._id);
        Meteor.call("checkUser", user._id, function (err, response) {
            if (err) {
                throw new Error(err);
            } else {
                if(response!=true){
                	throw new Error('User data not completed');
            	}
            }
        });
    });
});