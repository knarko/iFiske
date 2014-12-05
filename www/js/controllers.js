
angular.module('ifiske.controllers', [])
    .controller('HomeCtrl', ['$scope', '$state', '$ionicPopover', function($scope, $state, $ionicPopover) {

	// ToDo: This is all ugly, find a better solution
	if (window.localStorage.getItem('session')) {
	    $scope.var1 = "Min sida";
	    $scope.func1 = function() {
		$scope.popover.remove();
		$state.go("main.userinfo");
	    };
	    $scope.var2 = "Logga ut";
	    $scope.func2 = function() {
		console.log("Logout");
	    };
	} else {
	    $scope.var1 = "Logga in";
	    $scope.func1 = function() {
		$scope.popover.remove();
		$state.go("login");
	    };
	    $scope.var2 = "Registrera";
	    $scope.func2 = function() {
		console.log("Registrera");
	    };
	}

	
	$ionicPopover.fromTemplateUrl('templates/popover.html', {
	    scope: $scope,
	}).then(function(popover) {
	    $scope.popover = popover;
	});
	
	
    }])
    .controller('AreasCtrl', ['$scope', 'Areas', '$http', '$ionicLoading', function($scope, Areas, $http, $ionicLoading) {
	$ionicLoading.show();
	$http.get('https://www.ifiske.se/api/v2/api.php?m=get_areas')
	    .success(function(data) {
		$scope.areas = data.data.response;
		$ionicLoading.hide();
	    });
	$scope.clearSearch = function() {
	    //todo: clear search field
	};

    }])

    .controller('AreaDetailCtrl', ['$scope', '$http','$stateParams', 'Areas', function($scope, $http, $stateParams, Areas) {
	image_endpoint = "https://www.ifiske.se";
	$http.get('https://www.ifiske.se/api/v2/api.php?m=get_areas')
	    .success(function(data) {
		$scope.area = data.data.response[$stateParams.id];
		$scope.area.img = image_endpoint+"/photos/2/Sun_ray_in_the_woods_1920_x_1200_widescreen.jpg";
	    });
    }])

    .controller('LoginCtrl', ['$scope', '$state', 'API', function($scope, $state, API) {
	$scope.user = {};
	$scope.signIn = function(user) {
	    API.user_login(user.username, user.password)
		.success(function(data) {
		    console.log(data.status);
		    data.status === "success" && $state.go('main.home');
		})
	}
    }])

