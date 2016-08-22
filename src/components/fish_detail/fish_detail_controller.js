angular.module('ifiske.controllers')
.controller('FishDetailCtrl', function($scope, $stateParams, Fish) {
    $scope.fish = $stateParams.fish;
    if (!$scope.fish) {
        Fish.getOne($stateParams.id)
        .then(function(data) {
            $scope.fish = data;
        }, function(err) {
            console.log(err);
        });
    }
});
