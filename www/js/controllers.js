
angular.module('ifiske.controllers', [])
    .controller('HomeCtrl', ['$scope', '$state', '$ionicPopover', function($scope, $state, $ionicPopover) {
	var popoverContent = [];
	if (window.localStorage.getItem('session')) {
	    popoverContent.push({
		name: 'Min sida', 
		route: function() {
		    $scope.popover.remove();
		    $state.go("main.userinfo");
		}
	    });
	    popoverContent.push({
		name: 'Logga ut', 
		route: function() {
		    $scope.popover.remove();
		    $state.go("home");
		}
	    });

	} else {
	    popoverContent.push({
		name: 'Logga in', 
		route: function() {
		    $scope.popover.remove();
		    $state.go("main.login");
		}
	    });
	    popoverContent.push({
		name: 'Registrera', 
		route: function() {
		    $scope.popover.remove();
		    $state.go("main.register");
		}
	    });
	}
	$scope.popoverContent = popoverContent;

	
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
		    data.status === "success" && $state.go('home');
		})
	}
    }])

