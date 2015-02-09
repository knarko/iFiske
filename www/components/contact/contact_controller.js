angular.module('ifiske.controllers')
.controller('ContactCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
    API.get_contact_info()
    .success(function(data) {
        $scope.contactInfo = data.data.response;
    });
}]);
