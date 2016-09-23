angular.module('ifiske.controllers')
.controller('ContactCtrl', function($scope, Terms) {
    $scope.contactInfo = Terms.getContactInfo();
});
