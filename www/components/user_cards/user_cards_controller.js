angular.module('ifiske.controllers')
.controller('UserCardsCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    $scope.pred = '-to';
    $scope.now = Date.now();
    DB.getUserProducts()
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
        console.log(err);
    });
}]);
