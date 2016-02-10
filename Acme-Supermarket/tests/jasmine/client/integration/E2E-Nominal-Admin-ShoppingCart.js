describe("E2E - Nominal - admin - Shopping Cart", function() {
    it("should setup MongoDB for testing", function () {
        Meteor.call('clearDB', function(){
            Meteor.call('loadFixtures');
        });
        Meteor.call('createAdmin');
        Accounts.createUser({email: "admin@admin.com",password: "admin"});
        
    });
    

    it("should be able to login admin user", function (done) {
    	
        Meteor.loginWithPassword('admin@admin.com', 'admin', function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });
    it("Access to admin", function (done) {
        Router.go('/admin');
        setTimeout(function(){
          expect($('p.alert-info').text()).toEqual('');
          done();
        }, 1000);
    });
    
    it("Access to list shopping cart", function (done) {
        Router.go('/admin/ShoppingCarts');
        
        setTimeout(function(){
          expect($('h1').text()).toContain('ShoppingCarts');
          done();
        }, 1000);
        
    });
    
    it("create a ShoppingCarts", function (done) {
      Router.go('/admin/ShoppingCarts/new');

      setTimeout(function(){
        $('input[name=userId]').val(Meteor.userId());
        $('input[name="items.0.productCode"]').val(1);
        $('input[name="items.0.amount"]').val(2);
        setTimeout(function(){
          $("button.btn-primary").click();
          setTimeout(function(){
            Router.go('/admin/ShoppingCarts');
            setTimeout(function(){
              expect($('tr').length == 4).toEqual(true);//comprueba que existen 4 lineas(2 ShoppingCarts y 2 cabeceras)
              done();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    });

    
    it("update a ShoppingCarts", function (done) {
      var href = $('a.btn-primary:last').attr('href');
      setTimeout(function(){
        Router.go(href);
        
        setTimeout(function(){
          $('input[name=userId]').val(Meteor.userId());
          $('input[name="items.0.productCode"]').val(2);
          $('input[name="items.0.amount"]').val(4);
          $('input[type=checkbox]').prop("checked", true);
          setTimeout(function(){
            $("button.btn-primary").click();
            var res = Meteor.userId() + 'true';
            setTimeout(function(){
              expect($('tr.even:last').text()).toContain(res);
              done();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000)
    });
    it("delete a ShoppingCarts", function (done) {
      $('a.btn-danger')[0].click();
      setTimeout(function(){
        $('#confirm-delete').click();
        setTimeout(function(){
          expect($('tr').length == 3).toEqual(true);
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
});