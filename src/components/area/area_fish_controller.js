angular.module('ifiske.controllers')
.controller('AreaFishCtrl', [
    '$scope',
    function($scope) {
        $scope.$on('$ionicView.beforeEnter', function() {
            console.log('beforeenter area_fish_controller.js', $scope);
        });

        $scope.sortorder = '-amount';
    },
]);
