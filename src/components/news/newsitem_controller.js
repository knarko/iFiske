angular.module('ifiske.controllers')
  .controller('NewsItemCtrl', function($scope, $stateParams, News) {
    if ($stateParams.item) {
      $scope.item = $stateParams.item;
    } else {
      News.getOne($stateParams.id).then(function(data) {
        $scope.item = data;
      });
    }
  });
