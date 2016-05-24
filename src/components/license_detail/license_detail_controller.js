angular.module('ifiske.controllers')
.controller('LicenseDetailCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$ionicModal',
    '$sce',
    function($scope, $stateParams, DB, $ionicModal, $sce) {
            function updateQR() {

            $scope.qr = $sce.trustAsResourceUrl('data:image/png;base64,'+$scope.product.qr);
            }
        if ($stateParams.license) {
            $scope.product = $stateParams.license;
            updateQR();
        } else {
            //TODO: get license from DB, or from api
            DB.getUserProduct($stateParams.id).then(function(license) {
                var now = parseInt(Date.now() / 1000);
                $scope.product = license;
                updateQR();
                $scope.product.validity = $scope.product.fr < now ? now < $scope.product.to ? 'valid' : 'expired' : 'inactive';
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
        //use the same modal as in area_cards
        $ionicModal.fromTemplateUrl('components/area/rules_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.rules_modal = modal;
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
    }
]);
