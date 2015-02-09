angular.module('ifiske.controllers')
.controller('AreasCtrl', ['$scope', '$stateParams', '$ionicScrollDelegate' ,'DB', function($scope, $stateParams, $ionicScrollDelegate ,DB) {

    $scope.search = {'$': $stateParams.search};
    $scope.queryBy = '$';
    $scope.county = $stateParams.county;
    DB.search('', $stateParams.id)
    .then(function(data) {
            $scope.areas = data;
    }, function(err) {
        console.log(err);
    });
    $scope.clearSearch = function() {
        //todo: clear search field
    };
    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop();
    };

}]);

