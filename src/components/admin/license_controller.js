angular.module('ifiske.controllers')
  .controller('AdminLicenseCtrl', function($stateParams, $scope) {
    $scope.$on('$ionicView.beforeEnter', function() {
      console.log($stateParams);
      if (!$stateParams.license) {
        $stateParams.license = {};
      }
      $scope.products = $stateParams.license.items;
      $scope.name = $stateParams.license.name;
    });
  });
