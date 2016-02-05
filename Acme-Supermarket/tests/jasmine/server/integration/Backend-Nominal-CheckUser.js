/*describe("Backend - Nominal - check user", function() {
    it("call check user and return true", function () {
        var user={
        _id : "YJsAJX5FvfwaBEQip",
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
        }};
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
});*/