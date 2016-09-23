angular.module('ifiske.controllers')
.controller('UserCtrl', function($scope, User) {
    User.getInfo()
    .then(function(user) {
        $scope.user = user;
    });
    User.getNumbers()
    .then(function(numbers) {
        $scope.numbers = numbers;
    });
});
