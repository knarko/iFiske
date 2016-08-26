angular.module('ifiske.controllers')
.controller('MenuCtrl', function(
    $scope,
    $state,
    $ionicViewSwitcher,
    $ionicPopover,
    sessionData,
    Update,
    User
) {
    $scope.sessionData = sessionData;

    $ionicPopover.fromTemplateUrl('components/menu/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.userinfo = function() {
        $scope.popover.hide();
        $state.go('app.userinfo');
    };
    $scope.logout = function() {
        $scope.popover.hide();
        User.logout();

        $state.go('app.login');
    };
    $scope.login = function() {
        $scope.popover.hide();
        $ionicViewSwitcher.nextDirection('back');
        $state.go('app.login');
    };
    $scope.register = function() {
        $scope.popover.hide();
        $state.go('app.register.fork');
    };

    $scope.forcedUpdate = function() {
        Update.forcedUpdate();
    };
});
