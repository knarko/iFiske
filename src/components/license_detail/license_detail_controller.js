angular.module('ifiske.controllers')
.controller('LicenseDetailCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$ionicModal',
    function($scope, $stateParams, DB, $ionicModal) {
        if ($stateParams.license) {
            $scope.product = $stateParams.license;
        } else {
            //TODO: get license from DB, or from api
            DB.getUserProduct($stateParams.id).then(function(license) {
                $scope.product = license;
                DB.getArea(license.ai).then(function(area) {
                    $scope.area = area;
                    DB.getOrganization(area.orgid).then(function(org) {
                        $scope.org = org;
                    });
                });
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
