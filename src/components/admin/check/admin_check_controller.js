angular.module('ifiske.controllers')
.controller('AdminCheckCtrl', function(Admin, $scope, $stateParams) {
    Admin.checkProduct($stateParams.code).then(function(product) {
        $scope.product = product;
    });
});
