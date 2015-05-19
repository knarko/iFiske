angular.module('ifiske.controllers')
.controller('AreasCtrl', [
    '$scope',
    '$stateParams',
    '$ionicScrollDelegate',
    'DB',
    function($scope, $stateParams, $ionicScrollDelegate, DB) {

        var copy = $stateParams.search;
        $scope.search = copy;
        $scope.county = $stateParams.county || 'Sökresultat';
        DB.search('', $stateParams.id)
        .then(function(data) {
            $scope.areas = data;
        }, function(err) {
            console.log(err);
        });
        $scope.clearSearch = function() {
            $scope.search = '';
        };
        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };

    }
]);

