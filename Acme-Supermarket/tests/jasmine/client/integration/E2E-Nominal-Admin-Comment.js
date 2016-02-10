describe("E2E - Nominal - admin - Comments", function() {
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
    
    it("Access to list Comments", function (done) {
        Router.go('/admin/Comments');
        
        setTimeout(function(){
          expect($('h1').text()).toContain('Comments');
          done();
        }, 1000);
        
    });
    
    it("create a Comment", function (done) {
      Router.go('/admin/Comments/new');

      setTimeout(function(){
        $('input[name=codePro]').val(1);
        $('input[name=userId]').val(Meteor.userId());
        $('input[name=userEmail]').val('admin@admin.admin');
        $('input[name=title]').val('Title comment');
        $('input[name=description]').val('description comment');
        setTimeout(function(){
          $("button.btn-primary").click();
          setTimeout(function(){
            Router.go('/admin/Comments');
            setTimeout(function(){
              expect($('tr').length == 3).toEqual(true);//comprueba que existen 3 lineas(1 productos y 2 cabeceras)
              done();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    });

    
    it("update a Comment", function (done) {
      var href = $('a.btn-primary').attr('href');
      setTimeout(function(){
        Router.go(href);
        
        setTimeout(function(){
          $('input[name=codePro]').val(1);
          $('input[name=userId]').val(Meteor.userId());
          $('input[name=userEmail]').val('customer@customer.customer');
          $('input[name=title]').val('Title update');
          $('input[name=description]').val('description update');
          setTimeout(function(){
            $("button.btn-primary").click();
            setTimeout(function(){
              expect($('tr.odd').text()).toContain('customer@customer.customer');
              done();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000)
    });
  
    it("delete a comment", function (done) {
      $('a.btn-danger')[0].click();
      setTimeout(function(){
        $('#confirm-delete').click();
        setTimeout(function(){
          expect($('tr').length == 1).toEqual(true);
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