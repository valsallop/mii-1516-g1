/*describe("E2E - Nominal - Update profile", function() {
    it("setup test case", function () {
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
        });
    });

    it("Register", function () {
        Router.go('/register');
        setTimeout(function(){
            $('input[name=email]').val('test@test.com');
            $('input[name=password]').val('123456');
            setTimeout(function(){
                $('.btn-primary').click();
                expect(Meteor.user().email).toMatch('test@test.com');
                
            }, 1000);
        }, 1000);
    });

    it("login", function () {
    	setTimeout(function(){
            Meteor.loginWithPassword('test@test.com', '123456', function (err) {
            	expect(err).toBeUndefined();
        	});
        }, 3000);
        
    });
    
    it("logout", function (done) {
        Meteor.logout(function (err) {
            expect(err).toBeUndefined();
            if(Meteor.userId()==null){
                done();
            }else{
                throw new Error('User keeps logged in');
            }
        });
        
    });
});*/