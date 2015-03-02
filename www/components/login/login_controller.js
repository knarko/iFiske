angular.module('ifiske.controllers')
.controller('LoginCtrl', ['$scope', '$state', 'API', '$ionicLoading', function($scope, $state, API, $ionicLoading) {
    //$scope.user = {};
    $scope.signIn = function(loginForm) {
        $ionicLoading.show();
	
        API.user_login(loginForm.username.$viewValue, loginForm.password.$viewValue)
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
