angular.module('ifiske.controllers')
.controller('FindAreasCtrl', [
    '$scope',
    '$ionicHistory',
    '$state',
    function($scope, $ionicHistory, $state) {
        $scope.goto = function(state) {
            $ionicHistory.viewHistory().currentView = $ionicHistory.viewHistory().backView;
            $state.go('app.find_areas.' + state, null, {
                location: 'replace'
            });
        };
    }
]);

