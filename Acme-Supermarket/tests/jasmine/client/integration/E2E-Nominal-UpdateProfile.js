describe("E2E - Nominal - Update profile", function() {
    it("setup test case", function () {
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
        });
        Accounts.createUser({email: 'test@test.com',password: '123456'});
    });

    it("login", function () {
        Meteor.loginWithPassword('test@test.com', '123456', function (err) {
            expect(err).toBeUndefined();
        });
    });

    it("update profile", function () {
    	Router.go('/updateProfile');
        
		$('input[name=name]').val('Test');
		$('input[name=surname]').val('Test');

		$('input[name="address.name"]').val('C/Test');
		$('input[name="address.number"]').val('16');
		$('input[name="address.postalCode"]').val('41005');

		$('input[name="creditCard.number"]').val('4120235645698563');
		$('input[name="creditCard.CVV"]').val('156');
		$('input[name="creditCard.expMonth"]').val('12');
		$('input[name="creditCard.expYear"]').val('2019');
		setTimeout(function(){
    		$('.glyphicon-edit').click();
    		setTimeout(function(){
    			expect(Meteor.user().name).toMatch('Test');
    			expect(Meteor.user().surname).toMatch('Test');

    			expect(Meteor.user().address.name).toMatch('C/Test');
    			expect(Meteor.user().address.number).toMatch('16');
    			expect(Meteor.user().address.postalCode).toMatch('41005');

    			expect(Meteor.user().creditCard.number).toMatch('4120235645698563');
    			expect(Meteor.user().creditCard.CVV).toMatch('156');
    			expect(Meteor.user().creditCard.expMonth).toMatch('12');
    			expect(Meteor.user().creditCard.expYear).toMatch('2019');
			}, 3000);
		}, 3000);		
    });

    // it("check loggedUser", function (done) {
    //     var id= Meteor.userId();
    //     if(id!=null){
    //         if(Meteor.user().emails[0].address=='test@test.com'){
    //             done();
    //         }
    //         else{
    //             throw new Error('Another user is logged in');
    //         }
    //     }
    //     throw new Error('No user logged in');
    // });

    // it("tear down", function (done) {
    //     Meteor.logout(function (err) {
    //         expect(err).toBeUndefined();
    //         if(Meteor.userId()==null){
    //             done();
    //         }else{
    //             throw new Error('User keeps logged in');
    //         }
    //     });
    // });
});