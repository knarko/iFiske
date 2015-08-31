angular.module('ifiske.controllers')
.controller('CountiesCtrl', ['$scope', 'DB', '$state', '$ionicHistory', function($scope, DB, $state, $ionicHistory) {
    var initialize = function() {
        DB.getCounties()
        .then(function(data) {
            $scope.counties = data;
        }, function(err) {
            console.log(err);
        });
    };
    $scope.$on('$ionicView.beforeEnter', initialize);
}]);
