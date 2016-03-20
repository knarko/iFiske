angular.module('ifiske.controllers')
.controller('LoginCtrl', [
    '$scope',
    '$state',
    '$window',
    'Update',
    '$ionicLoading',
    '$ionicHistory',
    '$ionicViewSwitcher',
    '$ionicPlatform',
    '$timeout',
    function($scope, $state, $window, Update, $ionicLoading, $ionicHistory, $ionicViewSwitcher, $ionicPlatform, $timeout) {

        $scope.$on('$ionicView.afterEnter', function() {
            $ionicPlatform.ready(function() {
                if ($window.navigator && $window.navigator.splashscreen) {
                    $timeout(function() {
                        $window.navigator.splashscreen.hide();
                    }, 500);
                }
            });
        });
        /**
         * signIn
         * Submit handler for login form. Validates login input.
         * Moves to home view on successful login.
         */
        $scope.signIn = function(loginForm) {
            $ionicLoading.show();

            Update.user_login(loginForm.username.$viewValue, loginForm.password.$viewValue)
            .then(function() {
                $ionicLoading.hide();
                loginForm.$setValidity('loginError', true);
                $ionicViewSwitcher.nextDirection('forward');
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('app.home');
            }, function(error) {
                $ionicLoading.hide();
                loginForm.$setValidity('loginError', false);
                $scope.error = error.response;
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
                historyRoot: true
            });
            $state.go('app.home');
        };
    }
]);
