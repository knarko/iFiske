angular.module('ifiske.controllers')
.controller('CountiesCtrl', ['$scope', 'DB', function($scope, DB) {
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
