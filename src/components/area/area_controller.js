angular.module('ifiske.controllers')
.controller('AreaCtrl', function(
    $scope,
    $stateParams,
    Area,
    Product,
    Organization
) {
    Area.getOne($stateParams.id)
    .then(function(area) {
        $scope.area = area;
        $scope.$broadcast('ifiske-area');

        Organization.getOne(area.orgid)
        .then(function(org) {
            $scope.org = org;
        });
    }, function(err) {
        console.warn(err);
    });

    Area.getFishes($stateParams.id)
    .then(function(fishes) {
        $scope.fishes = fishes;
    }, function(err) {
        console.warn(err);
    });

    Product.getByArea($stateParams.id)
    .then(function(products) {
        $scope.products = products;
    }, function(err) {
        console.warn(err);
    });
});
