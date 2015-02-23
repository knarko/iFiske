angular.module('ifiske.controllers')
.controller('HomeCtrl', ['$scope', '$state', '$ionicHistory', 'localStorage', function($scope, $state, $ionicHistory, localStorage) {
    localStorage.set('haxParentId', $ionicHistory.currentHistoryId());

    $scope.myFunc = function($event) {
        if($event.keyCode == 13 && !$event.shiftKey) { //if enter-key
            $state.go('menu.areas', {search: $event.srcElement.value});
        }

    };
}]);
