angular.module('ifiske.controllers')
    .controller('Area2Ctrl', ['$scope', '$state', '$ionicHistory', 'localStorage', function($scope, $state, $ionicHistory, localStorage) {
	var hist = $ionicHistory.currentHistoryId();

	$scope.test = function() {
	    console.log('------');

	    //var currentId = $ionicHistory.currentHistoryId();
	    /*var currentId = hist;
	      var parentId = $ionicHistory.viewHistory().histories[currentId].parentHistoryId;

	      console.log(currentId);
	      console.log(parentId);
	      console.log($ionicHistory.currentHistoryId());*/


	    var parentId = $ionicHistory.viewHistory()
		.histories[$ionicHistory.currentHistoryId()].parentHistoryId;
	    console.log('parentId:', parentId);
	    console.log('currentId:', $ionicHistory.currentHistoryId());
	    console.log($ionicHistory.viewHistory().histories);

	    $scope.$emit('$ionicHistory.change', {
		    historyId: localStorage.get('haxParentId')
	    });
	};
    }]);

