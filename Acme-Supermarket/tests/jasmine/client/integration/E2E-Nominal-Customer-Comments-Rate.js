/*describe("E2E - Nominal - Customer - Comment - Rate", function() {
    it("setup test case", function () {
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
        });
        //Meteor.call('createCustomer');
        Accounts.createUser({email: 'test@test.com',password: '123456'});
        
    });

    it("login", function (done) {
        Meteor.loginWithPassword('test@test.com', '123456', function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });

    it("commenting a product", function (done) {
    	Router.go('/product/1');
        setTimeout(function(){
    		$('input[name=title]').val('Test comment');
    		$('textarea[name=description]').val('Test description comment');

    		setTimeout(function(){
        		$('.btn-primary').click();
                expect($('.bubble-comment')).toBeDefined();
                done();
    		}, 1000);
        }, 1000);
    });

    it("rating a product", function (done) {
        Router.go('/product/1');
        setTimeout(function(){
            $('.rateit-hover').css('width', '16px');
            setTimeout(function(){
                $('.idRatingProduct').click();
                expect($('.toast-message').text()).toEqual('You must buy this product to rate');
                done();
            }, 1000);
        }, 1000);
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