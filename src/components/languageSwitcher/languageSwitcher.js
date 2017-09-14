angular.module('ifiske.controllers')
  .controller('languageSwitcher', function languageSwitcherController(
    $scope,
    $state,
    $translate,
    Settings,
    ToastService,
    $interval,
    Update,
  ) {
    $scope.languages = Settings.availableLanguages();
    $scope.changeLanguage = function(lang) {
      console.log(Settings.language(), lang);
      if (Settings.language() !== lang) {
        Settings.language(lang);
        Update.forcedUpdate();
      }
      ToastService.show('Language selected', 'long');
      if ($scope.$parent.closeModal) {
        $scope.$parent.closeModal();
      } else {
        $state.go('app.login');
      }
    };
    const languages = Object.keys(Settings.availableLanguages());
    let i = 0;
    $scope.viewTitle = $translate.instant(
      'Change language',
      null,
      null,
      languages[i++ % languages.length],
    );
    const interval = $interval(function() {
      $scope.viewTitle = $translate.instant(
        'Change language',
        null,
        null,
        languages[i++ % languages.length],
      );
    }, 3000);

    $scope.$on('$ionicView.leave', function() {
      $interval.cancel(interval);
    });
  });
