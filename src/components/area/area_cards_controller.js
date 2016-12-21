angular.module('ifiske.controllers')
.controller('AreaCardsCtrl', function(
    $scope,
    $ionicModal,
    localStorage,
    $ionicPopup,
    $cordovaInAppBrowser,
    Settings,
    $translate,
    $window,
    serverLocation,
    Terms
) {
    $scope.$on('$ionicView.beforeEnter', function() {
        // Area_Cards
        $scope.smsterms = Terms.getSmsTerms();
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
            if ($window.ga)
                $window.ga.trackEvent('Purchase', 'Open SMS Modal', product.ID);
            $scope.sms_modal.show();
            $scope.product = product;
        };
        $scope.closeModal = function() {
            $scope.sms_modal.hide();
        };
        $scope.persistApproveSMSRules = function() {
            if ($scope.SMSRules.approval === 'YES') {
                $ionicPopup.show({
                    title:    $translate.instant('SMS Rules'),
                    scope:    $scope,
                    cssClass: 'wide-popup',
                    template: '<p ng-bind-html="smsterms"></p>',
                    buttons:  [{
                        text:  $translate.instant('Cancel'),
                        type:  'button-default',
                        onTap: function() {
                            $scope.SMSRules.approval = 'NO';
                        },
                    }, {
                        text:  $translate.instant('Accept'),
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
            var url = serverLocation +
                '/mobile/index.php?lang=' +
                Settings.language() +
                '&p=5&i=' +
                id;
            $cordovaInAppBrowser.open(url, '_system');
            if ($window.ga)
                $window.ga.trackEvent('Purchase', 'Web', id);
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
});
