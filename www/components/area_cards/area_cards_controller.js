angular.module('ifiske.controllers')
.controller('AreaDetailCardCtrl', ['$scope', 'DB', '$stateParams', '$ionicModal', 'localStorage', 'API', function($scope, DB, $stateParams, $ionicModal, localStorage, API) {
    API.get_sms_terms()
    .then(function(terms) {
        //TODO: move somewhere else.
        localStorage.set('sms_terms', terms.data.response);
        $scope.smsterms = localStorage.get('sms_terms');
    });
    $scope.predicate = "so";
    DB.getProductsByArea($stateParams.id)
    .then(function(data) {
        $scope.products = data;
    }, function(err) {
        console.log(err);
    });

    //SMS-modal

    $ionicModal.fromTemplateUrl('components/area_cards/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function(product) {
        $scope.modal.show();
        $scope.product = product;
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
        $scope.rules_modal.remove();
    });

    $scope.showingterms = false;
    $scope.showTerms = function($event) {
        $scope.showingterms = !$scope.showingterms;
    };

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

}]);

