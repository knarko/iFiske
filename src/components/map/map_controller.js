angular.module('ifiske.controllers')
.controller('MapCtrl', [
    '$scope',
    'leafletData',
    '$ionicPlatform',
    'DB',
    '$cordovaGeolocation',
    '$cordovaDeviceOrientation',
    '$timeout',
    'localStorage',
    function($scope, leafletData, $ionicPlatform, DB) {
        console.log($scope);
        $scope.map = {};
        $scope.map.centerOnMe = true;
        $scope.$on('$ionicView.beforeEnter', function() {
            DB.search('').then(function(areas) {
                $scope.map.areas = areas;
            });
        });
    },
]);
