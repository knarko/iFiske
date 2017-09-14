angular.module('ifiske.controllers')
  .controller('FavoritesCtrl', function(
    $scope,
    User,
    ToastService,
    API,
    $translate,
    $ionicActionSheet,
  ) {
    function initialize() {
      User.getFavorites()
        .then(function(data) {
          $scope.favorites = data;
          console.log(data);
        });
    }

    $scope.$on('$ionicView.beforeEnter', initialize);

    function removeFavorite(area) {
      API.user_remove_favorite(area.ID).then(function() {
        User.removeFavorite(area.ID);
        $scope.favorites.splice($scope.favorites.indexOf(area), 1);
        ToastService.hide().then(() => {
          ToastService.show('Area removed from favorites');
        });
      });
    }

    $scope.notify = function(area) {
      console.log(area);
      API.user_set_favorite_notification(area.ID, area.not).then(function() {
        User.setFavoriteNotification(area.ID, area.not);
        ToastService.hide().then(() => {
          ToastService.show(area.not ?
            'Notifications are turned on' :
            'Notifications are turned off',
          );
        });
      });
    };
    $scope.openPopover = function(area) {
      $ionicActionSheet.show({
        buttons: [
          {
            text: area.not ?
              $translate.instant('Turn notifications off') :
              $translate.instant('Turn notifications on'),
          },
        ],
        destructiveText:          $translate.instant('Remove favorite'),
        destructiveButtonClicked: function() {
          removeFavorite(area);
          return true;
        },
        titleText:     $translate.instant('Edit favorite'),
        cancelText:    $translate.instant('Cancel'),
        buttonClicked: function() {
          area.not = (area.not + 1) % 2;
          $scope.notify(area);
          return true;
        },
        cancel: function() {},
      });
    };
  });
