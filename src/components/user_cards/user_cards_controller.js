angular.module('ifiske.controllers')
.controller('UserCardsCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    'Update',
    '$ionicModal',
    '$ionicLoading',
    function($scope, $stateParams, DB, Update) {
        $scope.pred = '-to';

        var initilize = function() {
            var a = Update.update();
            a.then(function() {
                $scope.now = Date.now();
                return DB.getUserProducts();
            })
            .then(function(data) {
                $scope.products = data;
                console.log($scope);
            }, function(err) {
                console.log(err);
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.$on('$ionicView.beforeEnter', initilize);
        $scope.update = function() {
            initilize();
        };
    }
]);
