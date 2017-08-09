angular.module('ifiske.controllers')
  .controller('LoginCtrl', function(
    $scope,
    $state,
    User,
    $ionicLoading,
    $ionicHistory,
    $ionicViewSwitcher,
    $translate,
  ) {
    /**
    * signIn
    * Submit handler for login form. Validates login input.
    * Moves to home view on successful login.
    * @param {DOM.FormElement} loginForm - Form with login data
    */
    $scope.signIn = function(loginForm) {
      $ionicLoading.show();

      User.login(loginForm.username.$viewValue, loginForm.password.$viewValue)
        .then(function() {
          $ionicLoading.hide();
          loginForm.$setValidity('loginError', true);
          $ionicViewSwitcher.nextDirection('forward');
          $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true,
          });
          $state.go('app.home');
        }, function(error) {
          $ionicLoading.hide();
          if (error) {
            loginForm.$setValidity('loginError', false);
            $scope.error = error.response;
          } else {
            $scope.error = $translate.instant('Network Error');
          }
        });
    };

    /**
    * skip
    * Skips to the home view. Forces forward transition and sets home as root view.
    */
    $scope.skip = function() {
      $ionicViewSwitcher.nextDirection('forward');
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
      });
      $state.go('app.home');
    };
  });
