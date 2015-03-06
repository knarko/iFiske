angular.module('ifiske.controllers')
.controller('LoginCtrl', ['$scope', '$state', 'Update', '$ionicLoading', function($scope, $state, Update, $ionicLoading) {
    //$scope.user = {};
    $scope.signIn = function(loginForm) {
        $ionicLoading.show();

        Update.user_login(loginForm.username.$viewValue, loginForm.password.$viewValue)
        .then(function(data) {
            $ionicLoading.hide();
            loginForm.$setValidity("loginError", true);
            $state.go('menu.home');
        }, function(error) {
            $ionicLoading.hide();
            loginForm.$setValidity("loginError", false);
            $scope.error = error.response;
        });
    };
}]);
