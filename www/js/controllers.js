
angular.module('ifiske.controllers', [])

.controller('AreasCtrl', ['$scope', 'Areas', function($scope, Areas) {
	$scope.items = Areas.all();
}])

.controller('AreaDetailCtrl', ['$scope', '$stateParams', 'Areas', function($scope, $stateParams, Areas) {
	$scope.area = Areas.get($stateParams.id);
}])

.controller('LoginCtrl', ['$scope', function($scope) {
}]);

