describe("Backend - Nominal - check user", function() {
    it("setup MongoDB for testing", function () {
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
        });
        Accounts.createUser({email: 'test@test.com',password: '123456'});
    });
    it("call check user and return true", function () {
       Meteor.call("checkUser", this.userId, function (err, response) {
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