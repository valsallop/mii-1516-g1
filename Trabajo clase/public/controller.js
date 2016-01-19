var app=angular.module('ProductViewApp', []);

app.controller('ProductViewCtrl',['$scope','$http',function($scope,$http){
    console.log("Controller initialized");

    /*
    var refresh = function (){
        $http.get('/products').success(function (products){
            console.log('Products received successfully');
            $scope.products = products;
        });
        $http.get('/recomendations').success(function (recomendations){
            console.log('Recomendations received successfully');
            $scope.recomendations = recomendations;
        });
    }

    refresh();
    */

    $scope.productCurrentPage = 0;
    $scope.productPageSize = 3;
    /* Developing purpose only*/
    $scope.products = [];
    $scope.numberOfProductPages=function(){
        return Math.ceil($scope.products.length/$scope.productPageSize);                
    }
    for (var i=0; i<14; i++) {
        $scope.products.push({
            id:   i,
            name: "the name" + i,
            description: "the description" + i,
            price: 100 + i
            }
        );
    }

    $scope.recomendationCurrentPage = 0;
    $scope.recomendationPageSize = 3;
    /* Developing purpose only*/
    $scope.recomendations = [];
    $scope.numberOfRecomendationPages=function(){
        return Math.ceil($scope.recomendations.length/$scope.recomendationPageSize);                
    }
    for (var i=0; i<3; i++) {
        $scope.recomendations.push({
            id:   i,
            name: "the name" + i,
            description: "the description" + i,
            price: 100 + i
            }
        );
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