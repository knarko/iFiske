angular.module('ifiske.controllers')
.controller('AreaCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    function($scope, $stateParams, DB) {
        $scope.$on('$ionicView.beforeEnter', function() {
            console.log('beforeenter area_controller.js');
        });

        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.area = area;
            $scope.$broadcast('ifiske-area');

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
        }, function(err) {
            console.log(err);
        });

        DB.getAreaFishes($stateParams.id)
        .then(function(fishes) {
            console.log(fishes);
            $scope.fishes = fishes;
        }, function(err) {
            console.log(err);
        });

        DB.getProductsByArea($stateParams.id)
        .then(function(products) {
            $scope.products = products;
        }, function(err) {
            console.log(err);
        });
    },
]);
