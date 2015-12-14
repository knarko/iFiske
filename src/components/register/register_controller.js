angular.module('ifiske.controllers')
    .controller('RegisterCtrl', [
        '$scope',
        '$state',
        '$ionicLoading',
        '$ionicModal',
        '$ionicScrollDelegate',
        '$ionicPlatform',
        '$cordovaToast',
        'API',
        'localStorage',
        function($scope, $state, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicPlatform, $cordovaToast, API, localStorage) {

            var details = $scope.details = {};

            /*
              Getter/setter for username.
              Stores username in localStorage, in case the app is closed before the
              verification process is complete. _username ensures that the value can become
              undefined when the input is invalid (required by ngModel).
            */
/*            var _username;
            details.username = function(username) {
                if (arguments.length) {
                    if (_username = username) {
                        localStorage.set('register_username', username);
                    }
                }
                return _username;
            }
  */

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
             * register
             * Submit handler for the registration form
             */
            $scope.register = function(form) {
                $ionicLoading.show();

                API.user_register(details.username, details.fullname, details.password,
                                  details.email, details.phone)
                    .then(function(data) {
                        // Save username in case app closes before completed account verification
                        localStorage.set('register_username', details.username);

                        // Proceed to account verification
                        $ionicLoading.hide();
                        $scope.formErrors = {};
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


            /**
             * verify
             * Submit handler for the verification form
             */
            $scope.verify = function(form) {
                $ionicLoading.show();

                // Get username from form or localStorage
                var username = form.username ? form.username.$viewValue : localStorage.get('register_username');

                API.user_confirm(username, form.vercode.$viewValue)
                    .then(function(data) {
                        $ionicPlatform.ready(function() {
                            $cordovaToast.showLongBottom('Ditt konto har skapats');
                        });
                        $scope.formErrors.validationError = false;
                        details = {};
                        localStorage.set('register_username', '');

                        $state.go('app.login');
                    }, function(error) {
                        if (error.error_code) {
                            form.vercode.$setValidity("verified", false);
                        } else {
                            $scope.formErrors.validationError = true;
                        }
                    })
                    .finally($ionicLoading.hide);
            };


            $scope.tos = localStorage.get('tos');
            //Modal with the EULA
            $ionicModal.fromTemplateUrl('components/register/eula.html', {
                scope: $scope,
                animation: 'slide-in-up'
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

        }]);
