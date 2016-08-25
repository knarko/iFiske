angular.module('ifiske.controllers')
.controller('LicenseDetailCtrl', function(
    $scope,
    $stateParams,
    DB,
    $ionicModal,
    $sce
) {
    function getProductValidity(product) {
        var now = parseInt(Date.now() / 1000);
        if (product.fr < now) {
            return now < product.to ? 'valid' : 'expired';
        }
        return 'inactive';
    }
    function updateQR() {
        $scope.qr = $sce.trustAsResourceUrl('data:image/png;base64,' + $scope.product.qr);
    }
    if ($stateParams.license) {
        $scope.product = $stateParams.license;
        updateQR();
    } else {
        // TODO: get license from DB, or from api
        DB.getUserProduct($stateParams.id).then(function(license) {
            $scope.product = license;
            updateQR();
            $scope.product.validity = getProductValidity($scope.product);
            if (license.ai) {
                DB.getArea(license.ai).then(function(area) {
                    $scope.area = area;
                    DB.getOrganization(area.orgid).then(function(org) {
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

    $scope.$on('$destroy', function() {
        $scope.rules_modal.remove();
    });
});
