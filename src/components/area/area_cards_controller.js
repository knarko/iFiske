angular.module('ifiske.controllers')
.controller('AreaCardsCtrl', [
    '$scope',
    '$ionicModal',
    'localStorage',
    '$ionicPopup',
    '$cordovaInAppBrowser',
    function($scope, $ionicModal, localStorage, $ionicPopup, $cordovaInAppBrowser) {
        $scope.$on('$ionicView.beforeEnter', function() {
            // Area_Cards
            $scope.smsterms = localStorage.get('sms_terms');
            $scope.predicate = 'so';
            $scope.SMSRules = {};
            $scope.SMSRules.approval = localStorage.get('sms-approval') || 'NO';

            // SMS-modal
            $ionicModal.fromTemplateUrl('components/area/sms_modal.html', {
                scope:     $scope,
                animation: 'slide-in-up',
            }).then(function(modal) {
                $scope.sms_modal = modal; // eslint-disable-line camelcase
            });
            $scope.openModal = function(product) {
                $scope.sms_modal.show();
                $scope.product = product;
            };
            $scope.closeModal = function() {
                $scope.sms_modal.hide();
            };
            $scope.persistApproveSMSRules = function() {
                if ($scope.SMSRules.approval === 'YES') {
                    $ionicPopup.show({
                        title:    'Regler för SMS-köp',
                        scope:    $scope,
                        cssClass: 'wide-popup',
                        template: '<p ng-bind-html="smsterms"></p>',
                        buttons:  [{
                            text:  'Avbryt',
                            type:  'button-default',
                            onTap: function() {
                                $scope.SMSRules.approval = 'NO';
                            },
                        }, {
                            text:  'OK',
                            type:  'button-positive',
                            onTap: function() {
                                localStorage.set('sms-approval', $scope.SMSRules.approval);
                            },
                        }],
                    });
                } else {
                    localStorage.set('sms-approval', $scope.SMSRules.approval);
                }
            };

            $scope.openProductInBrowser = function(id) {
                var url = 'https://www.ifiske.se/mobile/index.php?p=5&i=' + id;
                $cordovaInAppBrowser.open(url, '_system');
            };

            // Rules modal
            $ionicModal.fromTemplateUrl('components/area/rules_modal.html', {
                scope:     $scope,
                animation: 'slide-in-up',
            }).then(function(modal) {
                $scope.rules_modal = modal; // eslint-disable-line camelcase
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
    },
]);
