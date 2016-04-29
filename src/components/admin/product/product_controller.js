angular.module('ifiske.controllers')
.controller('AdminProductCtrl', [
    '$scope',
    '$stateParams',
    'Admin',
    function($scope, $stateParams, Admin) {
        $scope.isValid = function() {
            if ($scope.product) {
                var now = new Date();
                var from = new Date($scope.product.fr*1000);
                var to = new Date($scope.product.to*1000);
                return (from < now && now < to);
            }
        };
        $scope.product = $stateParams.product;
        if (!$scope.product) {
            Admin.getProduct($stateParams.prodid).then(function(product) {
                $scope.product = product;
            }, function() {
                Admin.getProducts($stateParams.id).then(function() {
                    Admin.getProduct($stateParams.prodid).then(function(product) {
                        $scope.product = product;
                    });
                });
            });
        }
    }
]);
