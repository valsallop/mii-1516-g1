var app=angular.module('ProductViewApp',[]);

app.controller('RegisterCtrl',['$scope','$http','$window',function($scope,$http,$window){

    $scope.registerUser= function(){
        console.log('inserting user');

        if($scope.user.password === $scope.user.pass2 && $scope.user.email === $scope.user.email2){
            
            var user1 = [$scope.user.name,$scope.user.surname,$scope.user.email,$scope.user.address,"37.546,-5.55",$scope.user.credit_card,$scope.user.password];
            alert(user1);

            $http.post('/api/registration',user1);
            $window.location.href = 'http://localhost:8080';
        }else{
            console.log("No es igual el email o el pass");
            alert("El email o la contraseña no son correctas");
        }
    }

}]);