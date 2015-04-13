angular.module('ifiske.controllers')
.controller('RegisterCtrl', [
    '$scope',
    '$state',
    '$ionicLoading',
    '$ionicModal',
    '$ionicScrollDelegate',
    'API',
    'localStorage',
    function($scope, $state, $ionicLoading, $ionicModal, $ionicScrollDelegate, API, localStorage) {

    var username;

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


    // Validation errors not tied to input field
    $scope.formErrors = {};

    /**
     * register
     * Submit handler for the registration form
     */
    $scope.register = function(form) {
        $ionicLoading.show();

        // Save phone number for next view
        $scope.phone = form.phone.$viewValue;

        // Save username for verify submit handler
        username = form.username.$viewValue;

        var password = form.password.$viewValue;
        var fullname = form.fullname.$viewValue;
        var email = form.email.$viewValue;

        API.user_register(username, fullname, password, email, $scope.phone)
        .then(function(data) {
            // Success: Go to verify account view
            $ionicLoading.hide();
            $state.go('^.verify');

        }, function(error) {
            /**
             * Error: Inform the user about failed registration
             * See API documentation for error codes
             */
            $scope.formErrors.registrationError = true;
            $ionicScrollDelegate.scrollTop(true);

            // Invalid Email
            if (error.error_code == 8) {
                form.email.$setValidity('invalidEmail', false);
            }
            // Username or Email already registered
            if (error.error_code == 9) {
                $scope.checkUsername(form.username);
                $scope.checkEmail(form.email);
            }
            // Invalid phone number
            if (error.error_code == 10) {
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

        var vercode = form.vercode;

        API.user_confirm(username, vercode.$viewValue)
        .then(function(data) {
            $state.go('start.login');
            vercode.$setValidity("verified", true);
            $ionicLoading.hide();

        }, function(error) {
            vercode.$setValidity("verified", false);
            $ionicLoading.hide();
        });
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
