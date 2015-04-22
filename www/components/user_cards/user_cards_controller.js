angular.module('ifiske.controllers')
.controller('UserCardsCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    'Update',
    '$ionicModal',
    function($scope, $stateParams, DB, Update, $ionicModal) {
        $scope.pred = '-to';
        $scope.endpoint = 'https://www.ifiske.se';

        var initilize = function() {
            $scope.now = Date.now();
            DB.getUserProducts()
            .then(function(data) {
                $scope.products = data;
            }, function(err) {
                console.log(err);
            });
        };

        $scope.$on('$ionicView.beforeEnter', initilize);
        //use the same modal as in area_cards
        $ionicModal.fromTemplateUrl('components/area_cards/rules_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.rules_modal = modal;
        });
        $scope.openRulesModal = function(product) {
            $scope.rules_modal.show();
            console.log(product);
            $scope.product = product;
        };
        $scope.closeRulesModal = function() {
            $scope.rules_modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.rules_modal.remove();
        });
        $scope.update = function() {
            Update.update()
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
                initilize();
            });
        };
    }
]);
