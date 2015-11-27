var app=angular.module('ProductViewApp',[]);

app.controller('RegisterCtrl',['$scope','$http',function($scope,$http){

    $scope.registerUser= function(){
        console.log('inserting user');
        /*$http.post('/contacts').success(function (contacts){
        console.log('Data received');
        $scope.contactlist=contacts;
        });*/
        if($scope.pass1 == $scope.pass2 && $scope.email1 == $scope.pass2){
            $http.post('/api/registration',$scope.user);
            redirectTo: '/index.html';
        }else{
            console.log("No es igual el email o el pass");
            redirectTo: '/index.html';
        }
    }

}]);