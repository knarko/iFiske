angular.module('ifiske.controllers')
.controller('ContactCtrl', ['$scope', '$state', 'localStorage', function($scope, $state, localStorage) {
        $scope.contactInfo = localStorage.get('contactInfo');
}]);
