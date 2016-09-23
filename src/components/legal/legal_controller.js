angular.module('ifiske.controllers')
.controller('LegalCtrl', function($scope, Terms) {
    $scope.tos = Terms.getTermsOfService();
});
