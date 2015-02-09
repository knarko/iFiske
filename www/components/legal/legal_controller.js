angular.module('ifiske.controllers')
.controller('LegalCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
    API.get_terms_of_service()
    .success(function(data) {
        $scope.tos = data.data.response;
    });
}]);
