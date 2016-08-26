angular.module('ifiske.controllers')
.controller('FavoritesCtrl', function(
    $scope,
    User,
    $cordovaToast,
    API,
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
                $cordovaToast.show('Området är nu borttaget från dina favoriter',
                'short', 'bottom');
            });
        });
    }

    $scope.notify = function(area) {
        console.log(area);
        API.user_set_favorite_notification(area.ID, area.not).then(function() {
            User.setFavoriteNotification(area.ID, area.not);
            $ionicPlatform.ready(function() {
                window.plugins.toast.hide();
                $cordovaToast.show('Notifikationer är ' + (area.not ? 'på' : 'av'),
                'short', 'bottom');
            });
        });
    };
    $scope.openPopover = function(area) {
        $ionicActionSheet.show({
            buttons: [
                {text: area.not ? 'Stäng av notifikationer' : 'Sätt på notifikationer'},
            ],
            destructiveText:          'Ta bort favorit',
            destructiveButtonClicked: function() {
                removeFavorite(area);
                return true;
            },
            titleText:     'Ändra din favorit',
            cancelText:    'Gör inget',
            buttonClicked: function() {
                area.not = !area.not;
                return true;
            },
            cancel: function() {},
        });
    };
});
