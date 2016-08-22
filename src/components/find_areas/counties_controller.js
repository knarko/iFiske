angular.module('ifiske.controllers')
.controller('CountiesCtrl', function($scope, County, $state, $ionicHistory) {
    var initialize = function() {
        County.getAll()
        .then(function(data) {
            $scope.counties = data;
        }, function(err) {
            console.log(err);
        });
    };
    $scope.$on('$ionicView.beforeEnter', initialize);
});
