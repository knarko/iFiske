angular.module('ifiske.controllers')
    .controller('RegisterVerify2Ctrl', [
        '$scope',
        'localStorage',
        function($scope, localStorage) {
            $scope.$on('$ionicView.beforeEnter', function() {
                $scope.details = {};
                $scope.details.phone = localStorage.get('register_phone');
                $scope.details.username = localStorage.get('register_username');
                $scope.details.vercode = '';
            });
        }
    ]);
