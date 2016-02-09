/*describe("E2E - Nominal - Customer - User - Cart", function() {
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

    it("update profile", function () {
    	Router.go('/updateProfile');
        setTimeout(function(){
    		$('input[name=name]').val('Test');
    		$('input[name=surname]').val('Test');

    		$('input[name="address.name"]').val('Reina Mercedes');
    		$('input[name="address.number"]').val('45');
    		$('input[name="address.postalCode"]').val('41012');

    		$('input[name="creditCard.number"]').val('4120235645698563');
    		$('input[name="creditCard.CVV"]').val('156');
    		$('input[name="creditCard.expMonth"]').val('12');
    		$('input[name="creditCard.expYear"]').val('2019');
    		setTimeout(function(){
        		$('.glyphicon-edit').click();
        		setTimeout(function(){
                    $(".bootbox-close-button").click();
        			expect(Meteor.user().name).toMatch('Test');
        			expect(Meteor.user().surname).toMatch('Test');

        			expect(Meteor.user().address.name).toMatch('Reina Mercedes');
        			expect(Meteor.user().address.number).toMatch('45');
        			expect(Meteor.user().address.postalCode).toMatch('41012');

        			expect(Meteor.user().creditCard.number).toMatch('**** **** **** 8563');
        			expect(Meteor.user().creditCard.CVV).toMatch('156');
        			expect(Meteor.user().creditCard.expMonth).toMatch('12');
        			expect(Meteor.user().creditCard.expYear).toMatch('2019');
    			}, 1000);
    		}, 1000);
        }, 1000);
    });


    it("Add product and confirm purchase", function () {
        setTimeout(function(){
            Router.go('/product/1');
            setTimeout(function(){
                $(".idAddCart").click();
                setTimeout(function(){
                    Router.go('/shoppingCart');
                    setTimeout(function(){
                        $(".addAmount").click();
                        setTimeout(function(){
                            $(".idDeleteItem:first").click();
                            setTimeout(function(){
                                Router.go('/product/2');
                                setTimeout(function(){
                                    $(".idAddCart").click();
                                    setTimeout(function(){
                                        Router.go('/shoppingCart');
                                        setTimeout(function(){
                                            $(".idConfirmCart").click();
                                            setTimeout(function(){
                                                $(".btn-primary").click();
                                                setTimeout(function(){
                                                    $("input.bootbox-input").val(4120235645698563);
                                                    setTimeout(function(){
                                                        $(".btn-primary").click();
                                                        setTimeout(function(){
                                                            Router.go('/orders');
                                                            expect($('a').attr('href')).toEqual('/product/2');
                                                        }, 2000);
                                                    }, 2000);
                                                }, 2000);
                                            }, 2000);
                                        }, 2000);
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 5000);
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