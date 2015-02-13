angular.module('ifiske.controllers')
.controller('LegalCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
    API.get_terms_of_service()
    .then(function(data) {
        $scope.tos = data.data.response;
    });
}]);
