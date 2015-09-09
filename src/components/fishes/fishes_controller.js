angular.module('ifiske.controllers')
.controller('FishesCtrl', ['$scope', 'DB', function($scope, DB) {
    $scope.sortorder = 'so';
    DB.getFishes()
    .then(function(data) {
        $scope.fishes = data;
        $scope.default_img = data[0].img;
    }, function(err) {
        console.log(err);
    });
}]);
