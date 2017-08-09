angular.module('ifiske.controllers')
  .controller('AreaInfoCtrl', function(
    $scope,
    sessionData,
    $ionicPopup,
    API,
    Area,
    User,
    $ionicPlatform,
    ToastService,
    $translate,
    $stateParams,
  ) {
    $scope.slideOptions = {
      loop:     true,
      autoplay: 3000,
    };

    Area.getPhotos($stateParams.id)
      .then(function(images) {
        $scope.images = images;
      }, function(err) {
        console.warn(err);
      });

    Area.getFiles($stateParams.id)
      .then(function(files) {
        $scope.files = files;
      }, function(err) {
        console.warn(err);
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
              ToastService.show('Area added to favorites');
            });
        } else {
          promise = API.user_remove_favorite($scope.area.ID).then(function() {
            return User.removeFavorite($scope.area.ID);
          }).then(function() {
            ToastService.show('Area removed from favorites');
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
