angular.module('ifiske.controllers')
.controller('AreaDetailCardCtrl', ['$scope', 'DB', '$stateParams', function($scope, DB, $stateParams) {
    $scope.predicate = "so";
    DB.getProductsByArea($stateParams.id)
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
         console.log(err);
    });
}]);

