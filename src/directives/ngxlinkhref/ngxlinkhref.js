angular.module('ifiske.directives')
  .directive('ngXlinkHref', function() {
    return {
      priority: 99,
      restrict: 'A',
      link:     function(_scope, _element, attr) {
        var attrName = 'xlink:href';
        attr.$observe('ngXlinkHref', function(value) {
          if (!value)
            return;

          attr.$set(attrName, value);
        });
      },
    };
  });
