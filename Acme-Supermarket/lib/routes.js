if(Meteor.isClient){
	Accounts.onLogin(function(){
		FlowRouter.go('addProduct');
	});

	Accounts.onLogout(function(){
		FlowRouter.go('home');
	});
	Meteor.subscribe('products');
	Meteor.subscribe('comments');
	Meteor.subscribe('ratings');
	Meteor.subscribe('userData');

}

if(Meteor.isServer){
	Accounts.onLogin(function(){
		console.log("test");
		Meteor.users.update(Meteor.userId(), {
        	$set: {lastLogin: new Date()}
      	});		
	});
}

FlowRouter.route('/register',{
	name: 'register',
	action(){
		BlazeLayout.render('register');
	}
});

FlowRouter.route('/login',{
	name: 'login',
	action(){
		BlazeLayout.render('login');
	}
});

FlowRouter.route('/shoppingCart', {
	name: 'shoppingCart',
  subscriptions: function(params) {
    this.register('shoppingCart', Meteor.subscribe('shoppingCarts'));
  },

  action: function() {
    // We render the template with Flow Layout
    FlowLayout.render('shoppingCart');
  }
});

// FlowRouter.route('/shoppingCart',{
// 	name: 'shoppingCart',
// 	action(){
// 		var item = ShoppingCarts.find({ active:true , userId: "'"+Meteor.userId()+"'" }).fetch();
// 		console.log(Meteor.userId());
// 		console.log(item);
// 		BlazeLayout.render('shoppingCart');
// 	}
// });

FlowRouter.route('/insert',{
	name: 'addProduct',
	action(){
		BlazeLayout.render('insertProduct');
	}
});

FlowRouter.route('/',{
	name: 'home',
	action(){
		BlazeLayout.render('home');
	}
});

FlowRouter.route('/updateProfile',{
	name: 'profile',
	action(){
		BlazeLayout.render('updateProfile');
	}
});

FlowRouter.route('/product/:code',{
	name: 'productDetail',
	action: function(params, queryParams){
		BlazeLayout.render('productDetail');
	}
});

FlowRouter.route('/products',{
	name: 'products',
	action(){
		BlazeLayout.render('allProducts');
	}
});


