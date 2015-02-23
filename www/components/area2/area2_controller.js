angular.module('ifiske.controllers')
    .controller('Area2Ctrl', ['$scope', '$state', '$ionicHistory', 'localStorage', '$rootScope', '$ionicViewSwitcher', function($scope, $state, $ionicHistory, localStorage, $rootScope, $ionicViewSwitcher) {
	var hist = $ionicHistory.currentHistoryId();

	$scope.test2 = function() {
	    console.log('------');
	};

	
	$scope.test = function() {
	    // If the current view is at the top of its history stack
	    if(!$ionicHistory.viewHistory().currentView.index) {
		/** 
		 * Switch to the home history stack
		 * See $ionicHistory source for the even handler used
		 * See home_controller.js for the historyId used
		 */
		$ionicViewSwitcher.nextDirection('back');
		$scope.$emit('$ionicHistory.change', {
		    historyId: localStorage.get('haxParentId')
		});
	    } else {
		// Default back action
		$rootScope.$ionicGoBack();
	    }
	};
    }])
   /* .run([$rootScope, $ionicHistory, function( $ionicHistory){
	//var prevGoBack = $rootScope.ionicGoBack;
	$rootScope.$ionicGoBack = function() {
	    
	    //$ionicHistory.goBack();
	};
    }]);*/

