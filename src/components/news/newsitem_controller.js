angular.module('ifiske.controllers')
.controller('NewsItemCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    function($scope, $stateParams, DB) {
        if ($stateParams.item) {
            $scope.item = $stateParams.item;
        } else {
            DB.getNewsItem($stateParams.id).then(function(data) {
                $scope.item = data;
            });
        }
    },
]);
