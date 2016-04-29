angular.module('ifiske.controllers')
.controller('AdminCtrl', [
    '$scope',
    '$stateParams',
    'API',
    '$q',
    '$ionicLoading',
    function($scope, $stateParams, API, $q, $ionicLoading) {

        $scope.id = $stateParams.id;
        $ionicLoading.show();
        var p = [];
        p.push(API.adm_products($stateParams.id).then(function(res) {
            $scope.products = res;
        }));
        $scope.org = $stateParams.org;
        if (!$scope.org) {
            p.push(API.user_organizations().then(function(res) {
                $scope.org = res[$stateParams.id];
            }));
        }

        $q.all(p).finally(function() {
            $ionicLoading.hide();
        });
    }
]);
