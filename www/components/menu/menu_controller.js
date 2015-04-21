angular.module('ifiske.controllers')
.controller('MenuCtrl', [
    '$scope',
    '$state',
    '$ionicViewSwitcher',
    '$ionicPopover',
    'sessionData',
    'Update',
    function($scope, $state, $ionicViewSwitcher, $ionicPopover, sessionData, Update) {

    $scope.sessionData = sessionData;

    $ionicPopover.fromTemplateUrl('components/menu/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.userinfo = function() {
	$scope.popover.hide();
	$state.go('app.userinfo');
    };
    $scope.logout = function() {
	$scope.popover.hide();
	Update.user_logout();

	$state.go('app.login');
    };
    $scope.login = function() {
	$scope.popover.hide();
	$ionicViewSwitcher.nextDirection('back');
	$state.go('app.login');
    };
    $scope.register = function() {
	$scope.popover.hide();
	$state.go('app.register.details');
    };

    $scope.update = function() {
        Update.forcedUpdate();
    };

}]);
