angular.module('ifiske.controllers')
.controller('AreaCtrl', function(
    $scope,
    $stateParams,
    Area,
    Product,
    Organization
) {
    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('beforeenter area_controller.js');
    });

    Area.getOne($stateParams.id)
    .then(function(area) {
        $scope.area = area;
        $scope.$broadcast('ifiske-area');

        Organization.getOne(area.orgid)
        .then(function(org) {
            $scope.org = org;
        });
    }, function(err) {
        console.log(err);
    });

    Area.getFishes($stateParams.id)
    .then(function(fishes) {
        console.log(fishes);
        $scope.fishes = fishes;
    }, function(err) {
        console.log(err);
    });

    Product.getByArea($stateParams.id)
    .then(function(products) {
        console.log('ppp', products);
        $scope.products = products;
    }, function(err) {
        console.log(err);
    });
});
