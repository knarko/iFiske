angular.module('ifiske.controllers')
  .controller('RegisterCtrl', function(
    $scope,
    $state,
    $ionicLoading,
    $ionicModal,
    $ionicScrollDelegate,
    $ionicPlatform,
    $cordovaToast,
    $ionicViewSwitcher,
    $ionicHistory,
    $timeout,
    $interval,
    API,
    User,
    localStorage,
    Terms,
  ) {
    $scope.details = {};
    $scope.forms = {};

    /*
    Note:
    An attempt was made to simplify the validators using the validator pipelines
    introduced in Angular 1.3. No way was found to trigger validation on blur for
    some validators in a pipeline, and on submit for others.
    */

    // Validation errors not tied to a specific input field
    $scope.formErrors = {};

    // Live check for username availability
    $scope.checkUsername = function(input) {
      API.user_exists(input.$viewValue)
        .then(function(data) {
          input.$setValidity('nameTaken', !data);
        });
    };

    // Live check for email availability
    $scope.checkEmail = function(input) {
      API.user_exists(null, input.$viewValue)
        .then(function(data) {
          input.$setValidity('emailTaken', !data);
        });
    };

    /**
     * Submit handler for the registration form
     * @param  {DOMObject} form the register form
     */
    $scope.register = function(form) {
      $ionicLoading.show();

      var userDetails = {
        username: $scope.details.username,
        fullname: $scope.details.fullname,
        password: $scope.details.password,
        email:    $scope.details.email,
        phone:    $scope.details.phone,
      };

      // API does not accept '-' in phone numbers
      userDetails.phone = userDetails.phone.replace(/-/, '');
      $scope.phoneNumber = userDetails.phone;

      API.user_register(userDetails)
        .then(function() {
          // Save user details for later use
          localStorage.set('register_user_details', JSON.stringify(userDetails));
          startTimer();

          // Proceed to account verification
          $ionicLoading.hide();
          $scope.formErrors = {};
          $scope.details = {};
          $scope.forms.registerForm.$setPristine();
          $state.go('^.verify');
        }, function(error) {
          /**
            * Error: Inform the user about failed registration
            * See API documentation for error codes
            *
            * ToDo: Handle timeouts
            */
          $scope.formErrors.registrationError = true;
          $ionicScrollDelegate.scrollTop(true);

          // Invalid Email
          if (error.error_code === 8) {
            form.email.$setValidity('invalidEmail', false);
          }
          // Username or Email already registered
          if (error.error_code === 9) {
            $scope.checkUsername(form.username);
            $scope.checkEmail(form.email);
          }
          // Invalid phone number
          if (error.error_code === 10) {
            form.phone.$setValidity('invalidPhone', false);
          }

          $ionicLoading.hide();
        });
    };

    $scope.retryRegister = function() {
      var userDetails = getUserDetails();
      if (!userDetails) {
        // Navigate back to initial registration
        return;
      }
      API.user_register(userDetails)
        .then(function() {
          if (window.plugins && window.plugins.toast) {
            $cordovaToast.showShortBottom('Ny aktiveringskod skickad');
          }
        }, function(err) {
          console.error(err);
          Raven.captureException(err);
          if (window.plugins && window.plugins.toast) {
            $cordovaToast.showLongBottom(
              'Ett fel uppstod, aktiveringskoden kunde inte skickas.',
            );
          }
        });
    };

    var timer, endoftime;
    function startTimer() {
      $scope.timePassed = false;
      $scope.timeLeft = 1000 * 60 * 3;
      timer = $interval(function() {
        $scope.timeLeft -= 1000;
      }, 1000);
      endoftime = $timeout(function() {
        stopTimer();
      }, $scope.timeLeft);
    }
    function stopTimer() {
      $interval.cancel(timer);
      $timeout.cancel(endoftime);
      $scope.timePassed = true;
    }
    stopTimer();

    function getUserDetails() {
      try {
        return JSON.parse(localStorage.get('register_user_details'));
      } catch (err) {
        // TODO: this is shit, more user info pls
        console.error(err);
        Raven.captureException(err);
        return false;
      }
    }

    /**
     * Submit handler for the verification form
     * @param  {DOMObject} form the verification form
     */
    $scope.verify = function(form) {
      $ionicLoading.show();

      var userDetails = getUserDetails();
      if (!userDetails) {
        $ionicLoading.hide();
        return;
      }

      var username = (form.username && form.username.$viewValue) || userDetails.username;

      API.user_confirm(username, form.vercode.$viewValue)
        .then(function() {
          $ionicPlatform.ready(function() {
            if (window.plugins && window.plugins.toast) {
              $cordovaToast.showLongBottom('Ditt konto har skapats');
            }
          });
          $scope.formErrors.validationError = false;
          $scope.details = {};

          if (userDetails.password) {
            User.login(userDetails.username, userDetails.password)
              .then(function() {
                $ionicViewSwitcher.nextDirection('forward');
                $ionicHistory.nextViewOptions({
                  disableBack: true,
                  historyRoot: true,
                });
                $state.go('app.home');
              })
              .catch(function(err) {
                console.warn(err);
              })
              .finally(function() {
                // Clean up user details
                localStorage.set('register_user_details', '');
              });
          } else {
            $state.go('app.login');
          }
        }, function(error) {
          if (error.error_code) {
            form.vercode.$setValidity('verified', false);
            stopTimer();
          } else {
            $scope.formErrors.validationError = true;
          }
        })
        .finally($ionicLoading.hide);
    };

    $scope.tos = Terms.getTermsOfService();
    // Modal with the EULA
    $ionicModal.fromTemplateUrl('components/register/eula.html', {
      scope:     $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.eula = modal;
    });
    $scope.showEula = function() {
      $scope.eula.show();
    };
    $scope.closeEula = function() {
      $scope.eula.hide();
    };
    $scope.$on('$destroy', function() {
      $scope.eula.remove();
    });
  });
