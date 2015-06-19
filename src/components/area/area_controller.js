angular.module('ifiske.controllers')
.controller('AreaCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    function($scope, $stateParams, DB, $ionicSlideBoxDelegate) {
        $scope.image_endpoint = 'http://www.ifiske.se/';
        $scope.starred = false;

        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.area = area;
            $scope.$broadcast('ifiske-area');

            area.images.then(function(images) {
                $scope.images = images;
            }, function(err) {
                console.error(err);
            });

            $ionicSlideBoxDelegate.$getByHandle('tabs').update();
            $ionicSlideBoxDelegate.$getByHandle('tabs').enableSlide(false);

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
        }, function(err) {
            console.log(err);
        });

        DB.getAreaFishes($stateParams.id)
        .then(function(fishes) {
            $scope.fishes = fishes;
            $ionicSlideBoxDelegate.$getByHandle('tabs').update();
        }, function(err) {
            console.log(err);
        });

        DB.getProductsByArea($stateParams.id)
        .then(function(products) {
            $scope.products = products;
            $ionicSlideBoxDelegate.$getByHandle('tabs').update();
        }, function(err) {
            console.log(err);
        });

    }
]);
