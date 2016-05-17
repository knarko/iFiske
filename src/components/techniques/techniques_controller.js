angular.module('ifiske.controllers')
.controller('TechniquesCtrl', ['$scope', 'DB', function($scope, DB) {
    $scope.sortorder = 'so';

    DB.getTechniques()
    .then(function(data) {
        $scope.techniques = data;
    });
}]);
