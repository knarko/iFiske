angular.module('ifiske.controllers')
.controller('FishesCtrl', function($scope, Fish) {
    $scope.sortorder = 'so';
    Fish.getAll()
    .then(function(data) {
        $scope.fishes = data;
        $scope.default_img = data[0].img; // eslint-disable-line camelcase
    }, function(err) {
        console.log(err);
    });
});
