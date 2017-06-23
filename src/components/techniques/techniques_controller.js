angular.module('ifiske.controllers')
  .controller('TechniquesCtrl', function($scope, Technique) {
    $scope.sortorder = 'so';

    Technique.getAll()
      .then(function(data) {
        $scope.techniques = data;
      });
  });
