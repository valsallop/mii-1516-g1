/*describe("E2E - Nominal - User logs in", function() {
    it("setup test case", function () {
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
        });
        Accounts.createUser({email: 'test@test.com',password: '123456'});
    });
    

    it("login", function (done) {
        Meteor.loginWithPassword('test@test.com', '123456', function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });

    it("check loggedUser", function (done) {
         var id= Meteor.userId();
         if(id!=null){
            if(Meteor.user().emails[0].address=='test@test.com'){
                done();
            }
            else{
                throw new Error('Another user is logged in');
            }
            
         }
         throw new Error('No user logged in');
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