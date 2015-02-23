angular.module('ifiske.controllers')
    .controller('Area2Ctrl', ['$scope', '$state', '$ionicHistory', 'localStorage', '$rootScope', '$ionicViewSwitcher', function($scope, $state, $ionicHistory, localStorage, $rootScope, $ionicViewSwitcher) {
	var hist = $ionicHistory.currentHistoryId();

	$scope.test2 = function() {
	    console.log('------');

	    //var currentId = $ionicHistory.currentHistoryId();
	    /*var currentId = hist;
	      var parentId = $ionicHistory.viewHistory().histories[currentId].parentHistoryId;

	      console.log(currentId);
	      console.log(parentId);
	      console.log($ionicHistory.currentHistoryId());*/


	    /*	    
	    var parentId = $ionicHistory.viewHistory()
		.histories[$ionicHistory.currentHistoryId()].parentHistoryId;
	    console.log('parentId:', parentId);
	    console.log('currentId:', $ionicHistory.currentHistoryId());
	    console.log($ionicHistory.viewHistory().histories);
	    */
	    /*	    
	    $scope.$emit('$ionicHistory.change', {
		    historyId: localStorage.get('haxParentId')
	    });*/
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

