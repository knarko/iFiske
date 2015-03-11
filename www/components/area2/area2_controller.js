angular.module('ifiske.controllers')
.controller('AreaCtrl', [
    '$scope',
    '$ionicHistory',
    'localStorage',
    '$rootScope',
    '$ionicViewSwitcher',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    '$ionicModal',
    function($scope, $ionicHistory, localStorage, $rootScope, $ionicViewSwitcher, $stateParams, DB, $ionicSlideBoxDelegate, $ionicModal) {

        $scope.tabsBack = function() {
            // If the current view is at the top of its history stack
            if(!$ionicHistory.viewHistory().currentView.index) {
                /**
                 * Switch to the home history stack
                 * See $ionicHistory source for the even handler used
                 * See home_controller.js for the historyId used
                 */
                $ionicViewSwitcher.nextDirection('back');
                $scope.$emit('$ionicHistory.change', {
                    historyId: localStorage.get('homeHistoryId')
                });
            } else {
                // Default back action
                $rootScope.$ionicGoBack();
            }
        };

        $scope.image_endpoint = 'http://www.ifiske.se';

        // Areainfo
        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.images = area.images;

            $ionicSlideBoxDelegate.update();
            $scope.area = area;

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
        }, function(err) {
            console.log(err);
        });

        DB.getAreaFishes($stateParams.id)
        .then(function(fishes) {
            console.log(fishes);
            $scope.fishes = fishes;
        }, function(err) {
             console.log(err);
        });

        DB.getProductsByArea($stateParams.id)
        .then(function(products) {
            $scope.products = products;
        }, function(err) {
            console.log(err);
        });

        // Area fishes
        $scope.sortorder = '-amount';

        //Area_Cards
        $scope.smsterms = localStorage.get('sms_terms');
        $scope.predicate = "so";


        //SMS-modal
        $ionicModal.fromTemplateUrl('components/area_cards/modal.html', {
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
        $scope.showTerms = function($event) {
            $scope.showingterms = !$scope.showingterms;
        };
        $scope.showingterms = false;

        //Rules modal
        $ionicModal.fromTemplateUrl('components/area_cards/rules_modal.html', {
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

    }
]);
