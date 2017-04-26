angular.module('ifiske.controllers')
.controller('LicenseDetailCtrl', function(
    $scope,
    $stateParams,
    Area,
    User,
    Organization,
    $ionicModal,
    serverLocation,
    Settings,
    $cordovaInAppBrowser,
    analytics,
    $sce
) {
    function updateQR() {
        $scope.qr = $sce.trustAsResourceUrl('data:image/png;base64,' + $scope.product.qr);
    }
    if ($stateParams.license) {
        $scope.product = $stateParams.license;
        updateQR();
    } else {
        User.getProduct($stateParams.id).then(function(license) {
            $scope.product = license;
            updateQR();
            if (license.ai) {
                Area.getOne(license.ai).then(function(area) {
                    $scope.area = area;
                    Organization.getOne(area.orgid).then(function(org) {
                        $scope.org = org;
                    });
                });
            }
        });
    }
    $scope.now = Date.now();
    console.log($scope);
    // use the same modal as in area_cards
    $ionicModal.fromTemplateUrl('components/area/rules_modal.html', {
        scope:     $scope,
        animation: 'slide-in-up',
    }).then(function(modal) {
        $scope.rules_modal = modal; // eslint-disable-line camelcase
    });
    $scope.openRulesModal = function() {
        $scope.rules_modal.show();
    };
    $scope.closeRulesModal = function() {
        $scope.rules_modal.hide();
    };

    $scope.openProductInBrowser = function(id) {
        var url = serverLocation +
            '/mobile/index.php?lang=' +
            Settings.language() +
            '&p=5&i=' +
            id;
        $cordovaInAppBrowser.open(url, '_system');
        analytics.trackEvent('Purchase', 'Web', id);
    };

    $scope.$on('$destroy', function() {
        $scope.rules_modal.remove();
    });
});
