if(Meteor.isClient){
	Accounts.onLogin(function(){
		Router.go('home');
	});

	Accounts.onLogout(function(){
		Router.go('home');
	});
	Meteor.subscribe('products');
	Meteor.subscribe('comments');
	Meteor.subscribe('ratings');
	Meteor.subscribe('userData');
	Meteor.subscribe('shoppingCarts');

}

if(Meteor.isServer){
	Accounts.onLogin(function(){
		Meteor.users.update(Meteor.userId(), {
        	$set: {lastLogin: new Date()}
      	});		
	});
}

Router.route('/register',{
	name: 'register',
	action(){
		BlazeLayout.render('register');
	}
});

Router.route('/login',{
	name: 'login',
	action(){
		BlazeLayout.render('login');
	}
});

Router.route('/insert',{
	name: 'addProduct',
	action(){
		BlazeLayout.render('insertProduct');
	}
});

Router.route('/',{
	name: 'home',
	action(){
		BlazeLayout.render('home');
	}
});

Router.route('/updateProfile',{
	name: 'profile',
	action(){
		BlazeLayout.render('updateProfile');
	}
});

Router.route('/product/:code',{
	name: 'productDetail',
	action: function(params, queryParams){
		BlazeLayout.render('productDetail');
	}
});

Router.route('/products',{
	name: 'products',
	action(){
		BlazeLayout.render('allProducts');
	}
});


Router.route('/shoppingCart', {
	name: 'shoppingCart',
	action(){
		BlazeLayout.render('shoppingCart');
	}
});

Houston.menu({
    'type': 'template',
    'use': 'proSocialNet',
    'title': 'Social Networks'
  });
// Router.route('/shoppingCart',{
// 	name: 'shoppingCart',
// 	action(){
// 		var item = ShoppingCarts.find({ active:true , userId: "'"+Meteor.userId()+"'" }).fetch();
// 		console.log(Meteor.userId());
// 		console.log(item);
// 		BlazeLayout.render('shoppingCart');
// 	}
// });




