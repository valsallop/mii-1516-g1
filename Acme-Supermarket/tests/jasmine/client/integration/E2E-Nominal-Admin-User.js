describe("E2E - Nominal - admin - user", function() {
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
    
    it("Access to list users", function (done) {
        Router.go('/admin/Users');
        
        setTimeout(function(){
          expect($('h1').text()).toContain('Users');
          done();
        }, 1000);
        
    });
    
    it("create a user", function (done) {
      Router.go('/admin/Users/new');

      setTimeout(function(){
        $('input[name=email]').val('customer@customer.customer');
        setTimeout(function(){
          $("button.btn-primary").click();
          setTimeout(function(){
            Router.go('/admin/users');
            setTimeout(function(){
              expect($('tr').length == 4).toEqual(true);//comprueba que existen 4 lineas(2 usuarios y 2 cabeceras)
              done();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    });
    it("delete a product", function (done) {
      $('a.btn-danger:last')[0].click();
      setTimeout(function(){
        $('#confirm-delete').click();
        setTimeout(function(){
          expect($('tr').length == 3).toEqual(true);//2 cabeceras y 1 usuario
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