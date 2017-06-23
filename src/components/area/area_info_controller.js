angular.module('ifiske.controllers')
  .controller('AreaInfoCtrl', function(
    $scope,
    sessionData,
    $ionicPopup,
    API,
    Area,
    User,
    $ionicPlatform,
    $cordovaToast,
    $translate,
    $stateParams,
  ) {
    $scope.slideOptions = {
      effect:     'slide',
      speed:      250,
      loop:       true,
      autoplay:   3000,
      autoHeight: true,
      pagination: undefined,
    };

    Area.getPhotos($stateParams.id)
      .then(function(images) {
        $scope.images = images;
        if ($scope.slider) {
          $scope.slider.updateLoop();
        }
      }, function(err) {
        console.warn(err);
      });

    Area.getFiles($stateParams.id)
      .then(function(files) {
        $scope.files = files;
      }, function(err) {
        console.warn(err);
      });

    $scope.$on('$ionicSlides.sliderInitialized', function(_event, data) {
      // grab an instance of the slider
      $scope.slider = data.slider;
      $scope.slider.updateLoop();
    });

    $scope.changeFavorite = function() {
      if (sessionData.token) {
        $scope.area.favorite = !$scope.area.favorite;
        var promise;
        if ($scope.area.favorite) {
          promise = API.user_add_favorite($scope.area.ID)
            .then(function() {
              return User.addFavorite($scope.area.ID);
            }).then(function() {
              return $ionicPlatform.ready(function() {
                $translate('Area added to favorites').then(function(translation) {
                  $cordovaToast.show(
                    translation,
                    'short',
                    'bottom',
                  );
                });
              });
            });
        } else {
          promise = API.user_remove_favorite($scope.area.ID).then(function() {
            return User.removeFavorite($scope.area.ID);
          }).then(function() {
            $ionicPlatform.ready(function() {
              $translate('Area removed from favorites').then(function(translation) {
                $cordovaToast.show(
                  translation,
                  'short',
                  'bottom',
                );
              });
            });
          });
        }
        promise.catch(function(err) {
          console.warn(err);
        });
      } else {
        $translate('Login required for favorite').then(function(translation) {
          $ionicPopup.alert({
            title: translation,
          });
        });
      }
    };
  });
