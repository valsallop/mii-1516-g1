describe("E2E - Nominal - admin - Products", function() {
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
    
    it("read products", function (done) {
        Router.go('/admin/Products');
        
        setTimeout(function(){
          expect($('h1').text()).toContain('Products');
          done();
        }, 1000);
        
    });
    
    it("create a product", function (done) {
      Router.go('/admin/products/new');

      setTimeout(function(){
        $('input[name=code]').val(404);
        $('input[name=name]').val('Prueba admin');
        $('input[name=cost]').val(404);
        $('input[name=description]').val('Descripcion del producto');
        $('input[name=image]').val('http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8NjIzMHxpbWFnZS9wbmd8aDEzL2g1OC84ODMzNjM0MDA5MTE4LnBuZ3xkYzI5N2YyZDg0ZmU5OWNkMWI3OTU1ZTUwNzdiOGY2ZDRjNmQ4MjY1OThkMTE2ODRiZTM4MTE3MjA4ZTY3ODE0.png');
        $('input[name=rating]').val(1.5);
        $('input[name=availability]').val(1);
        $('input[name=supplierId]').val('w4QCby6QvKQuhFRTG');
        $('input[name="tags.0"]').val('Prueba');
        setTimeout(function(){
          $("button.btn-primary").click();
          setTimeout(function(){
            Router.go('/admin/products');
            setTimeout(function(){
              expect($('tr').length == 5).toEqual(true);//comprueba que existen 5 lineas(3 productos y 2 cabeceras)
              done();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    });

    
    it("update a product", function (done) {
      var href = $('a.btn-primary').attr('href');
      setTimeout(function(){
        Router.go(href);
        
        setTimeout(function(){
          $('input[name=code]').val(406);
          $('input[name=name]').val('Prueba admin');
          $('input[name=cost]').val(404);
          $('input[name=description]').val('Descripcion del producto');
          $('input[name=image]').val('http://res.cloudinary.com/dc8yintyr/image/upload/bWFzdGVyfHJvb3R8NjIzMHxpbWFnZS9wbmd8aDEzL2g1OC84ODMzNjM0MDA5MTE4LnBuZ3xkYzI5N2YyZDg0ZmU5OWNkMWI3OTU1ZTUwNzdiOGY2ZDRjNmQ4MjY1OThkMTE2ODRiZTM4MTE3MjA4ZTY3ODE0.png');
          $('input[name=rating]').val(1.5);
          $('input[name=availability]').val(1);
          setTimeout(function(){
            $("button.btn-primary").click();
            setTimeout(function(){
              expect($('tr.odd').text()).toContain('406Prueba admin404');
              done();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000)
    });
  
    it("delete a product", function (done) {
      $('a.btn-danger')[0].click();
      setTimeout(function(){
        $('#confirm-delete').click();
        setTimeout(function(){
          expect($('tr').length == 4).toEqual(true);
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