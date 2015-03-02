angular.module('ifiske.controllers')
    .controller('RegisterCtrl', ['$scope', '$state', '$ionicLoading', 'API', function($scope, $state, $ionicLoading, API) {
	
	var username, password, phone;
	
	$scope.accountDetails = function(form) {
	    username = form.username.$viewValue;
	    password = form.password.$viewValue;
	    $state.go('^.userDetails');
	};

	$scope.userDetails = function(form) {
	    $ionicLoading.show();

	    var fullname = form.fullname.$viewValue;
	    var email = form.email.$viewValue;
	    phone = $scope.phone = form.phone.$viewValue;
	    
	    API.user_register(username, fullname, password, email, phone)
		.then(function(data) { 
		    $ionicLoading.hide();
		    $state.go('^.verify');
		}, function(error) {
		    // ToDo: display error
		    $ionicLoading.hide();
		});
	};

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
    }]);
