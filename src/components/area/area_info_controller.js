angular.module('ifiske.controllers')
.controller('AreaInfoCtrl', [
    '$scope',
    '$ionicSlideBoxDelegate',
    function($scope, $ionicSlideBoxDelegate) {
        $scope.gotoProducts = function() {
            $ionicSlideBoxDelegate.$getByHandle('tabs').slide(1);
        };
        $scope.$on('$ionicView.beforeEnter', function() {
        });
    }
]);
