
angular.module('ifiske.controllers', [])
.controller('HomeCtrl', ['$scope', '$http', '$ionicPopover', function($scope, $http, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/popover.html', function(popover) {
	$scope.popover = popover;
    });
    
    
}])
.controller('AreasCtrl', ['$scope', 'Areas', '$http', '$ionicLoading', function($scope, Areas, $http, $ionicLoading) {
	$ionicLoading.show();
	$http.get('https://www.ifiske.se/api/v2/api.php?m=get_areas')
		.success(function(data) {
			$scope.items = data.data.response;
			$ionicLoading.hide();
		});

}])

.controller('AreaDetailCtrl', ['$scope', '$http','$stateParams', 'Areas', function($scope, $http, $stateParams, Areas) {
	image_endpoint = "https://www.ifiske.se";
	$http.get('https://www.ifiske.se/api/v2/api.php?m=get_areas')
		.success(function(data) {
			$scope.area = data.data.response[$stateParams.id];
			$scope.area.img = image_endpoint+"/photos/2/Sun_ray_in_the_woods_1920_x_1200_widescreen.jpg";
		});
}])

.controller('LoginCtrl', ['$scope', function($scope) {
}]);

