angular.module('ifiske.controllers')
.controller('AreaInfoCtrl', [
    '$scope',
    '$ionicSlideBoxDelegate',
    'sessionData',
    '$ionicPopup',
    'API',
    'DB',
    '$ionicPlatform',
    '$cordovaToast',
    function($scope, $ionicSlideBoxDelegate, sessionData, $ionicPopup, API, DB, $ionicPlatform, $cordovaToast) {
        console.log($scope);
        $scope.gotoProducts = function() {
            $ionicSlideBoxDelegate.$getByHandle('tabs').slide(1);
        };
        $scope.$on('$ionicView.beforeEnter', function() {
        });

        $scope.changeFavorite = function() {
            if (sessionData.token) {
                $scope.area.favorite = !$scope.area.favorite;
                var promise;
                if ($scope.area.favorite) {
                    promise = API.user_add_favorite($scope.area.ID)
                    .then(function() {
                        return DB.addFavorite($scope.area.ID);
                    }).then(function() {
                        return $ionicPlatform.ready(function() {
                            $cordovaToast.show('Området är nu tillagt i dina favoriter', 'short', 'bottom');
                        });
                    });
                } else {
                    promise = API.user_remove_favorite($scope.area.ID).then(function() {
                        return DB.removeFavorite($scope.area.ID);
                    }).then(function() {
                        $ionicPlatform.ready(function() {
                            $cordovaToast.show('Området är nu borttaget från dina favoriter', 'short', 'bottom');
                        });
                    });
                }
                promise.catch(function(err) {
                    console.log(err);
                });
            } else {
                $ionicPopup.alert({
                    title: 'Du måste vara inloggad för att kunna markera fiskevatten som favoriter.',
                });
            }
        };
    }
]);
