angular.module('ifiske.controllers')
.controller('FishDetailCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    $scope.fish = $stateParams.fish;
    $scope.image_endpoint = 'http://www.ifiske.se';
    if(!$scope.fish) {
        DB.getFish($stateParams.id)
        .then(function(data) {
            $scope.fish = data;
    console.log($scope.fish);
        }, function(err) {
            console.log(err);
        });
    }
    console.log($scope.fish);
}]);
