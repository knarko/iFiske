angular.module('ifiske.controllers')
.controller('MenuCtrl', ['$scope', '$state', '$ionicPopover', function($scope, $state, $ionicPopover) {
    var popoverContent = [];

    // If logged in
    if (window.localStorage.getItem('session')) {
	// User info
        popoverContent.push({
            name: 'Min sida',
            route: function() {
                $scope.popover.remove();
                $state.go("menu.userinfo");
            }
        });

	// ToDo: Actual logout
        popoverContent.push({
            name: 'Logga ut',
            route: function() {
                $scope.popover.remove();
                $state.go('menu.home');
            }
        });

	// Not logged in
    } else {
	// Login
        popoverContent.push({
            name: 'Logga in',
            route: function() {
                $scope.popover.remove();
                $state.go("login");
            }
        });
	// ToDo: Remove and route through login screen?
	// Register
        popoverContent.push({
            name: 'Registrera',
            route: function() {
                $scope.popover.remove();
                $state.go("register");
            }
        });
    }
    $scope.popoverContent = popoverContent;

    $ionicPopover.fromTemplateUrl('components/menu/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });


}]);
