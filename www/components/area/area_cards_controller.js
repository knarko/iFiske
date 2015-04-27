angular.module('ifiske.controllers')
.controller('AreaCardsCtrl', [
    '$scope',
    '$ionicModal',
    'localStorage',
    function($scope, $ionicModal, localStorage) {
        $scope.$on('$ionicView.beforeEnter', function() {
            //Area_Cards
            $scope.smsterms = localStorage.get('sms_terms');
            $scope.predicate = 'so';

            //SMS-modal
            $ionicModal.fromTemplateUrl('components/area/sms_modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.sms_modal = modal;
            });
            $scope.openModal = function(product) {
                $scope.sms_modal.show();
                $scope.product = product;
            };
            $scope.closeModal = function() {
                $scope.sms_modal.hide();
            };
            $scope.showTerms = function() {
                $scope.showingterms = !$scope.showingterms;
            };
            $scope.showingterms = false;

            //Rules modal
            $ionicModal.fromTemplateUrl('components/area/rules_modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.rules_modal = modal;
            });
            $scope.openRulesModal = function(product) {
                $scope.rules_modal.show();
                $scope.product = product;
            };
            $scope.closeRulesModal = function() {
                $scope.rules_modal.hide();
            };

            $scope.$on('$destroy', function() {
                $scope.sms_modal.remove();
                $scope.rules_modal.remove();
            });
        });
    }
]);
