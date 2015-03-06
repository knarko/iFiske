angular.module('ifiske.controllers')
.controller('AreaFishInfoCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    $scope.sortorder = '-amount';
    $scope.image_endpoint = 'https://www.ifiske.se/';
    DB.getAreaFishes($stateParams.id)
    .then(function(fishes) {
        $scope.fishes = fishes;
        console.log(fishes);
    });
    DB.getArea($stateParams.id)
    .then(function(area) {
        $scope.area = area;

        DB.getOrganization(area.orgid)
        .then(function(org) {
            $scope.org = org;
        });
    }, function(err) {
        console.log(err);
    });
}]);
