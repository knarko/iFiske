angular.module('ifiske.controllers')
  .controller('RecoverCtrl', function(
    $scope,
    $state,
    $ionicPlatform,
    $ionicLoading,
    $cordovaToast,
    $translate,
    API,
  ) {
    /**
     * lostPassword
     * Submit handler for first form
     * @param  {form} form the form with the username
     */
    $scope.lostPassword = function(form) {
      $ionicLoading.show();

      var user = form.user.$viewValue;

      API.user_lost_password(user)
        .then(function(data) {
          // Set info message for next view
          var methods = [];
          if (data.mailed) {
            methods.push($translate.instant('Email'));
          }
          if (data.texted) {
            methods.push($translate.instant('SMS'));
          }
          $translate('Recovery code will soon be sent', {
            methods: methods,
            mailed:  Boolean(data.mailed),
          }).then(function(translation) {
            $scope.info = translation;
          });

          // Set username for next view
          $scope.user = user;

          $state.go('^.resetpassword');
        }, function(_error) {
          // ToDo: handle timeout?
          // ToDo: check error codes?
          form.user.$setValidity('invalidUser', false);
        })
        .finally($ionicLoading.hide);
    };

    /**
    * resetPassword
    * Submit handler for second form
    * @param {form} form the form with the new password
    *
    * ToDo: log in immediately?
    */
    $scope.resetPassword = function(form) {
      $ionicLoading.show();

      var user = form.user.$viewValue;
      var password = form.password.$viewValue;
      var code = form.code.$viewValue;

      API.user_reset_password(user, password, code)
        .then(function(_data) {
          // Success toast
          $translate('Password changed').then(function(translation) {
            $ionicPlatform.ready(function() {
              $cordovaToast.showShortBottom(translation);
            });
          });

          $state.go('app.login');

          // Navigate to current history root?
          // $ionicHistory.goToHistoryRoot($ionicHistory.currentView().historyId);
        }, function(error) {
          switch (error.error_code) {
          case 5:
            // invalid username
            form.user.$setValidity('invalidUser', false);
            break;
          case 13:
            form.password.$setValidity('passwordLength', false);
            break;
          case 16:
            form.code.$setValidity('invalidCode', false);
            break;
          default:
            console.warn('Unhandled error code from api', error);
            $translate('Unhandled API error').then(function(translation) {
              $ionicPlatform.ready(function() {
                $cordovaToast.showShortBottom(translation);
              });
            });
            break;
          }
        })
        .finally($ionicLoading.hide);
    };
  });
