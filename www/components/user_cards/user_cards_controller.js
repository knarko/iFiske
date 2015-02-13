angular.module('ifiske.controllers')
.controller('UserCardsCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    DB.getUserProducts()
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
        console.log(err);
    });
}]);
