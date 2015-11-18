angular.module('ifiske.controllers')
.controller('UserCardsCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    'Update',
    '$ionicModal',
    '$ionicLoading',
    function($scope, $stateParams, DB, Update, $ionicModal, $ionicLoading) {
        $scope.pred = '-to';
        $scope.endpoint = 'https://www.ifiske.se';

        var initilize = function() {
            $ionicLoading.show();
            var a = Update.update();
            console.log(a);
            a.then(function(hi) {
                console.log(hi);
            });
            a.finally(function() {
                console.log('helloä');
                $scope.now = Date.now();
                DB.getUserProducts()
                .then(function(data) {
                    $scope.products = data;
                    console.log($scope);
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                }, function(err) {
                    console.log(err);
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });
            });
        };

        $scope.$on('$ionicView.beforeEnter', initilize);
        //use the same modal as in area_cards
        $ionicModal.fromTemplateUrl('components/area/rules_modal.html', {
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
            initilize();
        };
    }
]);
