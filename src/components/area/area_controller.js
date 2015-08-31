angular.module('ifiske.controllers')
.controller('AreaCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$state',
    '$ionicHistory',
    '$ionicViewSwitcher',
    function($scope, $stateParams, DB, $state, $ionicHistory, $ionicViewSwitcher) {

        $scope.goto = function(state) {
            $ionicHistory.viewHistory().currentView = $ionicHistory.viewHistory().backView;
            $ionicViewSwitcher.nextTransition('none');
            $state.go('app.area.' + state, null, {
                location: 'replace'
            });
        };

        DB.getArea($stateParams.id)
        .then(function(area) {
            $scope.area = area;
            $scope.$broadcast('ifiske-area');

            area.images.then(function(images) {
                $scope.images = images;
            }, function(err) {
                console.error(err);
            });

            DB.getOrganization(area.orgid)
            .then(function(org) {
                $scope.org = org;
            });
        }, function(err) {
            console.log(err);
        });

        DB.getAreaFishes($stateParams.id)
        .then(function(fishes) {
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

    }
]);
