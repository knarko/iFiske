angular.module('ifiske.controllers')
.controller('HomeCtrl', ['$scope', '$state', function($scope, $state) {

    $scope.myFunc = function($event) {
        if($event.keyCode == 13 && !$event.shiftKey) { //if enter-key
            $state.go('menu.areas', {search: $event.srcElement.value});
        }

    };

}]);
