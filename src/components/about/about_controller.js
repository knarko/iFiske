angular.module('ifiske.controllers')
    .controller('AboutCtrl', ['$scope','$cordovaAppVersion', '$ionicPlatform', 'Update', function($scope, $cordovaAppVersion, $ionicPlatform, Update) {
	$scope.version = $scope.dbDate = 'Okänt';
    $scope.update = Update;

	$ionicPlatform.ready(function() {
	    if (window.cordova) {
		$cordovaAppVersion.getAppVersion().then(function(version) {
		    console.log('iFiske version:', version);
		    $scope.version = version;
		});
	    }
	});
}]);
