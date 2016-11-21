angular.module('ifiske.controllers')
.controller('AdminProductCtrl', function($scope, $stateParams, Admin, $ionicPopup, $translate, $ionicLoading, Product) {
    $ionicLoading.show();
    if ($stateParams.code) {
        $scope.code = $stateParams.code;
        Admin.checkProduct($stateParams.code).then(function(product) {
            $scope.product = product;
            product.validity = Product.getValidity(product);
        }, function(err) {
            switch (err.error_code) {
            case 14:
            case 17:
                $scope.message = 'Not authorized to view this license';
                break;
            default:
                $scope.message = 'Network error';
            }
            console.warn(err);
        }).finally(function() {
            $ionicLoading.hide();
        });
    } else if ($stateParams.productID) {
        $scope.productID = $stateParams.productID;
        $scope.product = $stateParams.product;
        if (!$scope.product) {
            Admin.getProduct($stateParams.id, $stateParams.productID).then(function(product) {
                console.log(product);
                $scope.product = product;
            }, function(err) {
                console.warn(err);
            }).finally(function() {
                $ionicLoading.hide();
            });
        } else {
            $ionicLoading.hide();
        }
    }
    $scope.confirmRevokeLicense = function() {
        $ionicPopup.show({
            title:    $translate.instant('Are you sure?'),
            template: $translate.instant('This will revoke the license'),
            buttons:  [
                {
                    text: $translate.instant('Cancel'),
                    type: 'button-default',
                },
                {
                    text:  $translate.instant('Revoke'),
                    type:  'button-assertive',
                    onTap: function(_e) {
                        Admin.revokeProduct($scope.product);
                    },
                },
            ],
        });
    };
});
