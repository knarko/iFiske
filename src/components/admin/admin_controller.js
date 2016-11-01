angular.module('ifiske.controllers')
.controller('AdminCheckCtrl', function() {});
angular.module('ifiske.controllers')
.controller('AdminCtrl', function(
  $scope,
  $state,
  $stateParams,
  Admin,
  $ionicLoading,
  $cordovaBarcodeScanner
) {
    $scope.id = $stateParams.id;
    $ionicLoading.show();

    $scope.org = $stateParams.org;
    if ($scope.org) {
        $ionicLoading.hide();
    } else {
        Admin.getOrganization($stateParams.id).then(function(org) {
            $scope.org = org;
        }).finally(function() {
            $ionicLoading.hide();
        });
    }

    $scope.scanQR = function() {
        try {
            $cordovaBarcodeScanner.scan().then(function(res) {
                if (res.cancelled) {
                    throw new Error('Cancelled');
                }
                if (res.format === 'QR_CODE') {
                    var url = new URL(res.text);
                    if (url.searchParams.get('e')) {
                        return url.searchParams.get('e');
                    }
                } else {
                    throw new Error('Not a QR code');
                }
            }).then(function(code) {
            // TODO: check if code is valid and display to user
                console.log(code);
            }, function(err) {
                console.warn(err);
            });
        } catch (e) {
            $state.go('app.admin_check', {code: '904192'});
        }
    };
});
