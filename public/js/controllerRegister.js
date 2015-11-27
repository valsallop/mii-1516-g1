var app=angular.module('ProductViewApp',[]);

app.controller('RegisterCtrl',['$scope','$http','$window',function($scope,$http,$window){

    $scope.registerUser= function(){
        console.log('inserting user');

        if($scope.user.password === $scope.user.pass2 && $scope.user.email === $scope.user.email2){
            $scope.user.gps_coord = "37.546,-5.55";
            $http.post('/api/registration',user);
            $window.location.href = 'http://localhost:8080';
        }else{
            console.log("No es igual el email o el pass");
            alert("El email o la contraseña no son correctas");
        }
    }

}]);