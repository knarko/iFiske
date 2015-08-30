angular.module('ifiske.controllers')
.controller('TechniquesCtrl', ['$scope', 'DB', function($scope, DB) {

    $scope.sortorder = 'so';

    $scope.$on('$ionicView.beforeEnter', function() {
        DB.getTechniques()
        .then(function(data) {
            $scope.techniques = data;
        });
    });

}]);
