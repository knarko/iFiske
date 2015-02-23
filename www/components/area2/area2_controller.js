angular.module('ifiske.controllers')
.controller('Area2Ctrl', ['$scope', '$ionicHistory', 'localStorage', '$rootScope', '$ionicViewSwitcher', function($scope, $ionicHistory, localStorage, $rootScope, $ionicViewSwitcher) {

    $scope.tabsBack = function() {
        // If the current view is at the top of its history stack
        if(!$ionicHistory.viewHistory().currentView.index) {
            /**
             * Switch to the home history stack
             * See $ionicHistory source for the even handler used
             * See home_controller.js for the historyId used
             */
            $ionicViewSwitcher.nextDirection('back');
            $scope.$emit('$ionicHistory.change', {
                historyId: localStorage.get('homeHistoryId')
            });
        } else {
            // Default back action
            $rootScope.$ionicGoBack();
        }
    };
}]);
