angular.module('ifiske.controllers')
.controller('AdminProductCtrl', function($scope, $stateParams, Admin, $ionicPopup, $translate, $ionicLoading, Product) {
    console.log('stuff stuff', $stateParams);
    function init(force) {
        if ($stateParams.code) {
            $ionicLoading.show();
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
            if (!$scope.product || force) {
                Admin.getProduct($stateParams.productID).then(function(product) {
                    console.log(product);
                    $scope.product = product;
                }, function(err) {
                    console.warn(err);
                    $scope.message = err;
                }).finally(function() {
                    $ionicLoading.hide();
                });
            } else {
                $ionicLoading.hide();
            }
        }
    }
    init();
    $scope.confirmRevokeLicense = function(flag) {
        $ionicPopup.show({
            title:    $translate.instant('Are you sure?'),
            template: $translate.instant(flag ?
                'This will revoke the license' :
                'This will unrevoke the license'),
            buttons: [
                {
                    text: $translate.instant('Cancel'),
                    type: 'button-default',
                },
                {
                    text:  $translate.instant(flag ? 'Revoke' : 'Unrevoke'),
                    type:  'button-' + flag ? 'assertive' : 'balanced',
                    onTap: function(_e) {
                        var p;
                        if (flag) {
                            p = Admin.revokeProduct($scope.product);
                        } else {
                            p = Admin.unrevokeProduct($scope.product);
                        }
                        p.then(function() {
                            return Admin.getOrganizations();
                        }).then(function() {
                            init(true);
                        });
                    },
                },
            ],
        });
    };
});
