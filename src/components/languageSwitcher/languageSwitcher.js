angular.module('ifiske.controllers')
.controller('languageSwitcher', function languageSwitcherController(
    $scope,
    $cordovaToast,
    $state,
    $ionicPlatform,
    $translate,
    Settings,
    $window,
    $interval,
    Update
) {
    $scope.languages = Settings.availableLanguages();
    $scope.changeLanguage = function(lang) {
        console.log(Settings.language(), lang);
        if (Settings.language() !== lang) {
            Settings.language(lang);
            Update.forcedUpdate();
        }
        $ionicPlatform.ready(function() {
            var text = $translate.instant('Language selected');
            if ($window.plugins && $window.plugins.toast) {
                $cordovaToast.showLongBottom(text);
            } else {
                console.log('Toast: ', text);
            }
        });
        if ($scope.$parent.closeModal) {
            $scope.$parent.closeModal();
        } else {
            $state.go('app.login');
        }
    };
    var languages = Object.keys(Settings.availableLanguages());
    var i = 0;
    $scope.viewTitle = $translate.instant(
        'Change language',
        null,
        null,
        languages[i++ % languages.length]
    );
    var interval = $interval(function() {
        console.log(i);
        $scope.viewTitle = $translate.instant(
            'Change language',
            null,
            null,
            languages[i++ % languages.length]
        );
        console.log($scope.viewTitle, i, languages[i % languages.length]);
    }, 3000);

    $scope.$on('$ionicView.leave', function() {
        $interval.cancel(interval);
    });
});
