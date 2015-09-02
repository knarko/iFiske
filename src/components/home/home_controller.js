angular.module('ifiske.controllers')
.controller('HomeCtrl', [
    '$scope',
    '$state',
    '$ionicHistory',
    'localStorage',
    'sessionData',
    'Update',
    '$window',
    function($scope, $state, $ionicHistory, localStorage, sessionData, Update) {

        $scope.loggedIn = sessionData;

        $scope.update = Update;

        // Current history stack Id. See area_controller for usage.
        localStorage.set('homeHistoryId', $ionicHistory.currentHistoryId());

        $scope.news = function() {
            return localStorage.get('NEWS');
        };

        $scope.myFunc = function($event) {
            if ($event.keyCode === 13 && !$event.shiftKey) { //if enter-key
                $state.go('app.areas', {search: $event.srcElement.value});
            }

        };
    }
]);
