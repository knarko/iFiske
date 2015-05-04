angular.module('ifiske.controllers')
.controller('AreaFishCtrl', [
    '$scope',
    function($scope) {
        $scope.sortorder = '-amount';
        $scope.$on('$ionicView.beforeEnter', function() {
        });
    }
]);
