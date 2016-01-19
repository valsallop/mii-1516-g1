var myApp= angular.module("LoginApp",[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("Controller initialized");
	
	var refresh=function(){
		/* /contacts */
		/* http://localhost:57478/Home/Get*/
	$http.get('/login').success(function (){
		console.log('Login view');
		
	});
	};
	refresh();

	$scope.login= function(){
		console.log('getting token');
		request ('http://localhost:8080')
      	.post( "/api/authenticate" )
      	.send( {"email":email,"password":password} )
      	.end(function(err,res){
      		console.log("Req "+req.body);
			console.log("Res "+res.body);
		});
		refresh();


	}


}]);