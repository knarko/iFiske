angular.module('ifiske.controllers')
.controller('TechniquesCtrl', ['$scope', 'DB', function($scope, DB) {

    $scope.image_endpoint = 'http://www.ifiske.se';
    $scope.sortorder = 'so';

    $scope.$on('$ionicView.beforeEnter', function() {
        DB.getTechniques()
        .then(function(data) {
            $scope.techniques = data;
        });
    });

}]);
