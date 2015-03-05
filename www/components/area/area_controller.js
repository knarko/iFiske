angular.module('ifiske.controllers')
.controller('AreaDetailCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    function($scope, $stateParams, DB, $ionicSlideBoxDelegate) {
        $scope.image_endpoint = 'http://www.ifiske.se';
        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.images = area.images;

            $ionicSlideBoxDelegate.update();
            $scope.area = area;

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
        }, function(err) {
            console.log(err);
        });
    }
]);
