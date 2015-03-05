angular.module('ifiske.controllers')
.controller('MenuCtrl', [
    '$scope',
    '$state',
    '$ionicPopover',
    'sessionData',
    'Update',
    function($scope, $state, $ionicPopover, sessionData, Update) {

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
	Update.user_logout();

	$state.go('start.login');
    };
    $scope.login = function() {
	$scope.popover.hide();
	$state.go('start.login');
    };
    $scope.register = function() {
	$scope.popover.hide();
	$state.go('start.register.account_details');
    };

    $scope.update = function() {
        Update.forcedUpdate();
    };

}]);
