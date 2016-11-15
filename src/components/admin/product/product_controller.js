angular.module('ifiske.controllers')
.controller('AdminProductCtrl', function($scope, $stateParams, Admin) {
    $scope.productID = $stateParams.productID;
    $scope.product = $stateParams.product;
    if (!$scope.product) {
        Admin.getProduct($stateParams.id, $stateParams.productID).then(function(product) {
            console.log(product);
            $scope.product = product;
        }, function(err) {
            console.warn(err);
        });
    }
});
