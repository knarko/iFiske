angular.module('ifiske.controllers')
    .controller('AboutCtrl', ['$scope','$cordovaAppVersion', '$ionicPlatform', function($scope, $cordovaAppVersion, $ionicPlatform) {
	$scope.version = $scope.dbDate = 'Ok\u00E4nt';

	$ionicPlatform.ready(function() {
	    if (window.cordova) {
		$cordovaAppVersion.getAppVersion().then(function(version) {
		    console.log(version);
		    $scope.version = version;
		});
	    }
	});
}]);
