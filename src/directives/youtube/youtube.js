angular.module('ifiske.directives')
  .directive('youtube', function() {
    return {
      restrict:   'E',
      transclude: false,

      scope: {
        url: '=',
      },
      templateUrl: 'directives/youtube/youtube.html',

      link: function(scope, element, _attrs) {
        const iframe = element.find('iframe');
        scope.iframe = iframe[0];
      },
      controller: function($scope, $sce) {
        const fullscreenListeners = 'fullscreenchange webkitfullscreenchange mozfullscreenchange';
        function sendMessage(func) {
          console.log(func, $scope.iframe);
          return $scope.iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func:  func,
            args:  '',
          }), '*');
        }
        $scope.$on('$ionicParentView.afterEnter', function() {
          console.log('before enter in yt!');
          angular.element(document).on(fullscreenListeners, function(e) {
            console.log('Changing fullscreen mode', e);
            const fullScreenElement = document.fullscreenElement ||
                        document.webkitFullscreenElement ||
                        document.mozFullscreenElement;
            console.log(fullScreenElement);
            if (fullScreenElement) {
              window.screen.orientation.unlock();
            } else {
              window.screen.orientation.lock('portrait');
            }
          });
        });
        $scope.$on('$ionicParentView.beforeLeave', function() {
          console.log('Pausing YT video');
          angular.element(document).off(fullscreenListeners);
          if (window.screen.orientation) {
            window.screen.orientation.lock('portrait');
          }
          sendMessage('pauseVideo');
        });
        $scope.$watch('url', function(url) {
          const fullUrl = 'https://www.youtube.com/embed/' + url + '?enablejsapi=1';
          $scope.youtubeUrl = $sce.trustAsResourceUrl(fullUrl);
        });
      },
    };
  });
