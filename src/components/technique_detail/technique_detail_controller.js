angular.module('ifiske.controllers')
.controller('TechniqueDetailCtrl', [
    '$scope',
    '$stateParams',
    'DB',
    '$ionicSlideBoxDelegate',
    function($scope, $stateParams, DB, $ionicSlideBoxDelegate) {
        $scope.tech = $stateParams.tech;
        $scope.images = [];

        if (!$scope.tech) {
            DB.getTechnique($stateParams.id)
            .then(function(data) {
                $scope.images = [data.img1, data.img2, data.img3].filter(function(el) {
                    return !/\/$/.test(el);
                });

                $ionicSlideBoxDelegate.update();
                $scope.tech = data;
            });
        } else {
            var data = $scope.tech;
            $scope.images = [data.img1, data.img2, data.img3].filter(function(el) {
                return !/\/$/.test(el);
            });

            $ionicSlideBoxDelegate.update();
        }
    }
]);
