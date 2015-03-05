angular.module('ifiske.controllers')
.controller('AreaDetailCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    function($scope, $stateParams, DB, $ionicSlideBoxDelegate) {
        $scope.image_endpoint = 'http://www.ifiske.se';
        DB.getArea($stateParams.id)
        .then(function(data) {
            $scope.images = data.images;

            $ionicSlideBoxDelegate.update();
            $scope.area = data;
            $scope.area.img = 'img/test.jpg';
        }, function(err) {
            console.log(err);
        });
    }
]);
