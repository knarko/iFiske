angular.module('ifiske.controllers')
    .controller('AboutCtrl', ['$scope','$cordovaAppVersion', '$ionicPlatform', 'Update', function($scope, $cordovaAppVersion, $ionicPlatform, Update) {
	$scope.version = $scope.dbDate = 'Ok\u00E4nt';
    $scope.dbDate = Update.last_update();

	$ionicPlatform.ready(function() {
	    if (window.cordova) {
		$cordovaAppVersion.getAppVersion().then(function(version) {
		    console.log(version);
		    $scope.version = version;
		});
	    }
	});
}]);
