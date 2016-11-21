angular.module('ifiske.controllers')
.controller('AdminCheckCtrl', function() {});
angular.module('ifiske.controllers')
.controller('AdminCtrl', function(
  $scope,
  $state,
  $stateParams,
  Admin,
  $ionicLoading,
  $ionicPopup,
  $translate,
  $cordovaBarcodeScanner
) {
    $scope.id = $stateParams.id;
    $ionicLoading.show();

    $scope.org = $stateParams.org;

    function setValid(data) {
        $scope.revoked = [];
        $scope.valid = [];
        $scope.expired = [];
        $scope.inactive = [];
        for (var i = 0; i < data.length; ++i) {
            $scope[data[i].validity].push(data[i]);
        }
        $scope.products = data;
    }

    if ($scope.org) {
        setValid($scope.org.products);
        $ionicLoading.hide();
    } else {
        Admin.getOrganization($stateParams.id).then(function(org) {
            $scope.org = org;
            setValid(org.products);
        }).finally(function() {
            $ionicLoading.hide();
        });
    }

    $scope.checkLicense = function() {
        $ionicPopup.prompt({
            title:      $translate.instant('Check license'),
            template:   $translate.instant('Enter license code template'),
            cancelText: $translate.instant('Cancel'),
            okText:     $translate.instant('OK'),
        }).then(function(code) {
            if (code) {
                $state.go('^.product', {code: code});
            }
        });
    };

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
                console.log('Scanned: ', code);
                $state.go('^.product', {code: code});
            }, function(err) {
                console.warn(err);
            });
        } catch (e) {
            $state.go('^.product', {code: '904192'});
        }
    };
});
