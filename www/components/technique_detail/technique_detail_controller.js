angular.module('ifiske.controllers')
.controller('TechniqueDetailCtrl', ['$scope', '$stateParams', 'DB', function($scope, $stateParams, DB) {
    $scope.image_endpoint = 'http://www.ifiske.se';
    $scope.tech = $stateParams.tech;

    if(!$scope.tech) {
        DB.getTechnique($stateParams.id)
        .then(function(data) {
            $scope.tech = data;
        });
    }
}]);
