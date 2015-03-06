angular.module('ifiske.controllers')
.controller('UserCtrl', ['$scope', 'DB', function($scope, DB) {
    DB.getUserInfo()
    .then(function(user) {
        $scope.user = user;
    });
    DB.getUserNumbers()
    .then(function(numbers) {
        $scope.numbers = numbers;
    });
}]);
