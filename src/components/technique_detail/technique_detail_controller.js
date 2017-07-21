angular.module('ifiske.controllers')
  .controller('TechniqueDetailCtrl', function($scope, $stateParams, Technique) {
    $scope.tech = $stateParams.tech;
    $scope.images = [];

    $scope.slideOptions = {
      loop:     true,
      autoplay: 3000,
    };

    function loadImages(data) {
      $scope.images = [data.img1, data.img2, data.img3].filter(function(el) {
        return !/\/$/.test(el);
      });
    }

    if ($scope.tech) {
      loadImages($scope.tech);
    } else {
      Technique.getOne($stateParams.id)
        .then(function(data) {
          $scope.tech = data;
          loadImages(data);
        });
    }
  });
