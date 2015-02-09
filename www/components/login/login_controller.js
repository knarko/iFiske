angular.module('ifiske.controllers')
.controller('LoginCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
    $scope.user = {};
    $scope.signIn = function(user) {
        API.user_login(user.username, user.password)
        .success(function(data) {
            console.log(data.status);
            if (data.status === "success") {
                $state.go('home');
            }
        });
        // ToDo: Handle failed login
    };
}]);
