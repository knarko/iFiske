angular.module('ifiske.controllers')
.controller('FishDetailCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    function($scope, $stateParams, DB) {
        $scope.fish = $stateParams.fish;
        if (!$scope.fish) {
            DB.getFish($stateParams.id)
            .then(function(data) {
                $scope.fish = data;
            }, function(err) {
                console.log(err);
            });
        }
    }
]);
