angular.module('ifiske.controllers')
.controller('HomeCtrl', ['$scope', '$state', '$ionicHistory', 'localStorage', function($scope, $state, $ionicHistory, localStorage) {

    // Current history stack Id. See area_controller for usage.
    localStorage.set('homeHistoryId', $ionicHistory.currentHistoryId());

    $scope.myFunc = function($event) {
        if($event.keyCode == 13 && !$event.shiftKey) { //if enter-key
            $state.go('menu.areas', {search: $event.srcElement.value});
        }

    };
}]);
