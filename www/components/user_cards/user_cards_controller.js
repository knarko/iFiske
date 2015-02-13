angular.module('ifiske.controllers')
.controller('UserCardsCtrl', ['$scope', 'API','$stateParams', 'DB', function($scope, API, $stateParams, DB) {
    DB.getUserProducts()
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
        console.log(err);
    });
}]);
