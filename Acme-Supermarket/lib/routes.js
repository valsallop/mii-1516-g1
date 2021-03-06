if(Meteor.isClient){
	Accounts.onLogin(function(){
		Router.go('home');
	});

	Accounts.onLogout(function(){
		Router.go('home');
	});
	Meteor.subscribe('products');
	Meteor.subscribe('comments');
	Meteor.subscribe('supplierComments');
	Meteor.subscribe('ratings');
	Meteor.subscribe('userData');
	Meteor.subscribe('shoppingCarts');
	Meteor.subscribe('tags');
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

Router.route('/faq',{
	name: 'faq',
	action(){
		BlazeLayout.render('faq');
	}
});
Router.route('/updateProfile',{
	name: 'profile',
	action(){
		if (!Meteor.user()) {
      		bootbox.alert(TAPi18n.__("error_logIn", lang_tag=null));
      		Router.go('home');
    	}
    	else{
    		BlazeLayout.render('updateProfile');
    	}
		
	}
});
Router.route('/getProfile/:id',{
	name: 'profileDetails',
	action(){
		if (!Meteor.user()) {
      		bootbox.alert(TAPi18n.__("error_logIn", lang_tag=null));
      		Router.go('home');
    	}
    	else{
    		BlazeLayout.render('getProfile');
    	}
		
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
		if (!Meteor.user()) {
      		bootbox.alert(TAPi18n.__("error_logIn", lang_tag=null));
      		Router.go('home');
    	}
    	else{
            BlazeLayout.render('shoppingCart');
		}
	}
});

Router.route('/orders', {
	name: 'orderHistory',
	action(){
		if (!Meteor.user()) {
      		bootbox.alert(TAPi18n.__("error_logIn", lang_tag=null));
      		Router.go('home');
    	}
    	else{
            BlazeLayout.render('orderHistory');
		}
	}
});

Router.route('/createSupplier', {
  path: AdminDashboard.path('/createSupplier'),
  controller: 'AdminController',
  onAfterAction: function () {
    Session.set('admin_title', 'Create supplier');
  }
});

Router.route('/analytics/statistics', {
  path: AdminDashboard.path('/analytics/statistics'),
  controller: 'AdminController',
  onAfterAction: function () {
    Session.set('admin_title', 'Analytics');
  }
});

Router.route('/sentiments/tweets', {
  path: AdminDashboard.path('/sentiments/tweets'),
  controller: 'AdminController',
  onAfterAction: function () {
    Session.set('admin_title', 'Sentiments');
  }
});

Router.route('/map/routes', {
  path: AdminDashboard.path('/map/routes'),
  controller: 'AdminController',
  onAfterAction: function () {
    Session.set('admin_title', 'Routes');
  }
});

AdminDashboard.addSidebarItem('Create supplier', {
  icon: 'user',
  urls: [
    { title: 'Create', url: AdminDashboard.path('/createSupplier') }
  ]
});

AdminDashboard.addSidebarItem('Analytics', {
  icon: 'line-chart',
  urls: [
    { title: 'Statistics', url: AdminDashboard.path('/analytics/statistics') }
  ]
});

AdminDashboard.addSidebarItem('Sentiments', {
  icon: 'line-chart',
  urls: [
    { title: 'Sentiments', url: AdminDashboard.path('/sentiments/tweets') }
  ]
});

AdminDashboard.addSidebarItem('Routes', {
  icon: 'line-chart',
  urls: [
    { title: 'Routes', url: AdminDashboard.path('/map/routes') }
  ]
});

AdminConfig = {
  name: 'Acme-Supermarket',
  adminEmails: ['acmesupermarket@gmail.com'],
  collections: {
    Products: {
    	icon: 'gift',
	  omitFields: ['updatedAt'],
	  tableColumns: [
	   { label: 'Code', name: 'code'},
	   { label: 'Name', name: 'name' },
	   { label: 'Cost', name: 'cost'}
	  ],
	  showEditColumn: true, // Set to false to hide the edit button. True by default.
	  showDelColumn: true, // Set to false to hide the edit button. True by default.
	  showWidget: true,
	  color: 'red'
    },
    ShoppingCarts:{
        icon: 'shopping-cart',
      tableColumns: [
       { label: 'User ID', name: 'userId'},
       { label: 'State', name: 'active' },
       { label: 'Payment Date', name: 'paymentDate' },
       { label: 'Delivery Date', name: 'deliveryDate'}
      ],
      showEditColumn: true, // Set to false to hide the edit button. True by default.
      showDelColumn: true, // Set to false to hide the edit button. True by default.
      showWidget: true,
      color: 'yellow'
    },
    Comments: {
	  icon: 'comment',
	  omitFields: ['updatedAt'],
	  tableColumns: [
	   { label: 'Title', name: 'title' },
	   { label: 'Created', name: 'createdAt'},
	   { label: 'User', name: 'userEmail'}
	  ],
	  showEditColumn: true, // Set to false to hide the edit button. True by default.
	  showDelColumn: true, // Set to false to hide the edit button. True by default.
	  showWidget: true,
	  color: 'green'
	},
	SupplierComments: {
	  icon: 'comment',
	  omitFields: ['updatedAt'],
	  tableColumns: [
	   { label: 'Title', name: 'title' },
	   { label: 'Created', name: 'createdAt'},
	   { label: 'User', name: 'userEmail'}
	  ],
	  showEditColumn: true, // Set to false to hide the edit button. True by default.
	  showDelColumn: true, // Set to false to hide the edit button. True by default.
	  showWidget: true,
	  color: 'orange'
	}
  }
};
// Router.route('/shoppingCart',{
// 	name: 'shoppingCart',
// 	action(){
// 		var item = ShoppingCarts.find({ active:true , userId: "'"+Meteor.userId()+"'" }).fetch();
// 		console.log(Meteor.userId());
// 		console.log(item);
// 		BlazeLayout.render('shoppingCart');
// 	}
// });




