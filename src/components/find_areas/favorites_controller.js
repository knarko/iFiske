angular.module('ifiske.controllers')
.controller('FavoritesCtrl', function(
    $scope,
    User,
    $cordovaToast,
    API,
    $translate,
    $ionicActionSheet,
    $ionicPlatform
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
            $ionicPlatform.ready(function() {
                window.plugins.toast.hide();
                $cordovaToast.show(
                    $translate.instant('Area removed from favorites'),
                    'short',
                    'bottom'
                );
            });
        });
    }

    $scope.notify = function(area) {
        console.log(area);
        API.user_set_favorite_notification(area.ID, area.not).then(function() {
            User.setFavoriteNotification(area.ID, area.not);
            $ionicPlatform.ready(function() {
                window.plugins.toast.hide();
                $cordovaToast.show((area.not ?
                    $translate.instant('Notifications are turned on') :
                    $translate.instant('Notifications are turned off')),
                'short', 'bottom');
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
