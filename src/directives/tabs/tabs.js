angular.module('ifiske.directives', [])
.directive('ionicTabs', function() {
    return {
        scope: true,
        restrict: 'E',
        transclude: true,
        templateUrl: 'directives/tabs/tabs.html',
        link: function(scope) {
            console.log(scope);
        },
        controller: ['$scope', '$ionicHistory', '$state', '$ionicViewSwitcher', function($scope, $ionicHistory, $state, $ionicViewSwitcher) {
            // $scope is the appropriate scope for the directive
            $scope.tabs = [];
            this.addChild = function(nestedDirective) {
                $scope.tabs.push(nestedDirective);
            };
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
.directive('ionicTab', function() {
    return {
        scope:{
            icon: '@',
            name: '@',
            viewName: '@'
        },
        restrict: 'E',
        require: '^ionicTabs',
        link: function(scope, elem, attrs, controllerInstance) {
            console.log(scope);
            console.log(scope.$parent.area);
            controllerInstance.addChild(scope);
        }
    };
});

