angular.module('ifiske.controllers')
.controller('AdminCheckCtrl', function(Admin, $scope, $stateParams, $ionicLoading) {
    $ionicLoading.show();
    $scope.code = $stateParams.code;
    Admin.checkProduct($stateParams.code).then(function(product) {
        $scope.product = product;
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
});
