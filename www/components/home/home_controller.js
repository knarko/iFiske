angular.module('ifiske.controllers')
.controller('HomeCtrl', [
    '$scope',
    '$state',
    '$ionicHistory',
    'localStorage',
    'sessionData',
    function($scope, $state, $ionicHistory, localStorage, sessionData) {

        $scope.loggedIn = sessionData;

        // Current history stack Id. See area_controller for usage.
        localStorage.set('homeHistoryId', $ionicHistory.currentHistoryId());

        $scope.myFunc = function($event) {
            if($event.keyCode == 13 && !$event.shiftKey) { //if enter-key
                $state.go('menu.areas', {search: $event.srcElement.value});
            }

        };
    }
]);
