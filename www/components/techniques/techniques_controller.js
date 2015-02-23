angular.module('ifiske.controllers')
.controller('TechniquesCtrl', ['$scope', 'DB', function($scope, DB) {
    DB.getTechniques()
    .then(function(data) {
        console.log(data);
        $scope.techniques = data;
    });
    $scope.image_endpoint = 'http://www.ifiske.se';
    $scope.sortorder = 'so';

}]);
