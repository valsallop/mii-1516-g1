var app=angular.module('ProductViewApp', []);

app.controller('ProductViewCtrl',['$scope','$http',function($scope,$http){
    console.log("Controller initialized");

    
    var refresh = function (){
        $http.get('/api/products').success(function (products){
            console.log('Products received successfully');
            $scope.products = products;
        });
        $http.get('/api/recommended').success(function (recomendations){
            console.log('Recomendations received successfully');
            $scope.recomendations = recomendations;
        });
    }

    refresh();
    

    $scope.productCurrentPage = 0;
    $scope.productPageSize = 4;
    /* Developing purpose only*/
    $scope.products = [];
    $scope.numberOfProductPages=function(){
        return Math.ceil($scope.products.length/$scope.productPageSize);                
    }

    $scope.recomendationCurrentPage = 0;
    $scope.recomendationPageSize = 4;
    /* Developing purpose only*/
    $scope.recomendations = [];
    $scope.numberOfRecomendationPages=function(){
        return Math.ceil($scope.recomendations.length/$scope.recomendationPageSize);                
    }

}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});