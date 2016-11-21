angular.module('ifiske.controllers')
.controller('languageSwitcher', function languageSwitcherController(
    $scope,
    $cordovaToast,
    $state,
    $ionicPlatform,
    $translate,
    Settings,
    $window,
    Update
) {
    $scope.languages = Settings.availableLanguages();
    $scope.changeLanguage = function(lang) {
        console.log(Settings.language(), lang);
        if (Settings.language() !== lang) {
            Settings.language(lang);
            Update.forcedUpdate();
        }
        $window.ga.trackMetric('Language', lang);
        $ionicPlatform.ready(function() {
            var text = $translate.instant('Language selected');
            if (window.plugins && window.plugins.toast) {
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
});
