angular.module('ifiske.directives')
  .directive('ifiskeInput', function() {
    return {
      restrict:   'E',
      transclude: true,

      scope: {
        name:        '@',
        id:          '@',
        label:       '@',
        placeholder: '@',
        type:        '@',
        ngPattern:   '@',
        ngModel:     '=?',

      },
      templateUrl: 'directives/input_field/ifiske_input.html',
      controller:  function($scope) {
        $scope.id = $scope.id || $scope.name;
        $scope.type = $scope.type || 'text';
      },
    };
  });
