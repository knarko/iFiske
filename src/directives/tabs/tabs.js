angular.module('ifiske.directives')
.directive('hipTabs', function() {
    return {
        scope: true,
        restrict: 'E',
        transclude: true,
        templateUrl: 'directives/tabs/tabs.html',
        link: function(scope) {
            console.log(scope);
        },
        controller: ['$scope', '$ionicHistory', '$state', '$ionicViewSwitcher', function($scope, $ionicHistory, $state, $ionicViewSwitcher) {
            this.scope = $scope;
            $scope.goto = function(state) {
                $ionicHistory.viewHistory().currentView = $ionicHistory.viewHistory().backView;
                $ionicViewSwitcher.nextTransition('none');
                $state.go(state, null, {
                    location: 'replace'
                });
            };
        }]
    };
})
.directive('hipTab', function() {
    return {
        scope: {
            icon: '@',
            name: '@',
            viewName: '@'
        },
        restrict: 'E',
        require: '^hipTabs',
        replace: true,
        templateUrl: 'directives/tabs/tab.html',
        link: function(scope, elem, attrs, controllerInstance) {
            console.log(scope);
            scope.goto = controllerInstance.scope.goto;
        }
    };
});

