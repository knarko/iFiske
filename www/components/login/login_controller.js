angular.module('ifiske.controllers')
.controller('LoginCtrl', ['$scope', '$state', 'API', '$ionicLoading', function($scope, $state, API, $ionicLoading) {
    $scope.user = {};
    $scope.signIn = function(user) {
        $ionicLoading.show();
        API.user_login(user.username, user.password)
        .then(function(data) {
            $ionicLoading.hide();
            $scope.error = "";
            $state.go('menu.home');
        }, function(error) {
            $ionicLoading.hide();
            $scope.error = error.response;
        });
    };
}]);
