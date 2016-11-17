angular.module('ifiske.controllers')
.controller('AdminProductCtrl', function($scope, $stateParams, Admin, $ionicPopup, $translate) {
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
    $scope.confirmRevokeLicense = function() {
        $ionicPopup.show({
            title:    $translate.instant('Are you sure?'),
            template: $translate.instant('This cannot be undone'),
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
