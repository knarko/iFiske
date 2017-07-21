angular.module('ifiske.directives')
  .directive('swiper', function() {
    const defaultOptions = {
      direction:            'horizontal',
      effect:               'slide',
      speed:                300,
      preloadImages:        true,
      autoHeight:           true,
      loopAdditionalSlides: 1,
    };
    return {
      restrict:   'E',
      transclude: true,
      template:   '<div class="swiper-container"><div class="swiper-wrapper" ng-transclude></div></div>',

      scope: {
        options: '=',
      },
      controller: function(
        $scope,
        $element,
        $timeout,
      ) {
        $scope.$watch('options', options => {
          if ($scope.swiper) {
            $scope.swiper.destroy();
            delete $scope.swiper;
          }
          if (!options) {
            return;
          }
          const params = Object.assign({}, defaultOptions, options);
          $timeout(() => {
            $scope.swiper = new Swiper($element[0].firstChild, params);
          });
        });

        $scope.$on('ImgCache.loaded', () => {
          $scope.swiper.update(true);
          if ($scope.swiper && $scope.swiper.params.loop) {
            $scope.swiper.reLoop();
          }
        });
      },
    };
  });
