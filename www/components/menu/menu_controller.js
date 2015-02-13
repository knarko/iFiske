angular.module('ifiske.controllers')
.controller('MenuCtrl', ['$scope', '$state', '$ionicPopover', 'sessionData', 'API', function($scope, $state, $ionicPopover, sessionData, API) {

    $scope.sessionData = sessionData;

    $ionicPopover.fromTemplateUrl('components/menu/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.userinfo = function() {
	$scope.popover.hide();
	$state.go('menu.userinfo');
    };
    $scope.logout = function() {
	$scope.popover.hide();
	API.user_logout();
	$state.go('login');
    };
    $scope.login = function() {
	$scope.popover.hide();
	$state.go('login');
    };
    $scope.register = function() {
	$scope.popover.hide();
	$state.go('register.accountDetails');
    };


}]);
