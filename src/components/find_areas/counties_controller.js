angular.module('ifiske.controllers')
.controller('CountiesCtrl', function($scope, DB, $state, $ionicHistory) {
    var initialize = function() {
        DB.getCounties()
        .then(function(data) {
            $scope.counties = data;
        }, function(err) {
            console.log(err);
        });
    };
    $scope.$on('$ionicView.beforeEnter', initialize);
});
