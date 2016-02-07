/*describe("E2E - Nominal - admin - Analytics", function() {
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
    
    it("Download analytics", function () {
      Router.go('/admin/analytics/statistics');

      setTimeout(function(){
        $('#start').val('01/20/2016 12:00 AM');
        $('#end').val('01/27/2016 12:00 AM');
        setTimeout(function(){
          $(".showProduct:first").click();
          setTimeout(function(){
            $("#charts").click();
            setTimeout(function(){
              $("#report").click();
              setTimeout(function(){
                Router.go('/admin');
              }, 1000);
            }, 1000);
          }, 1000);
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