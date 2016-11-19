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
            var iframe = element.find('iframe');
            scope.iframe = iframe[0];
        },
        controller: function($scope, $sce) {
            var fullscreenListeners = 'fullscreenchange webkitfullscreenchange mozfullscreenchange';
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
                    var fullScreenElement = document.fullscreenElement ||
                        document.webkitFullscreenElement ||
                        document.mozFullscreenElement;
                    console.log(fullScreenElement);
                    if (fullScreenElement) {
                        window.screen.unlockOrientation();
                    } else {
                        window.screen.lockOrientation('portrait');
                    }
                });
            });
            $scope.$on('$ionicParentView.beforeLeave', function() {
                console.log('Pausing YT video');
                angular.element(document).off(fullscreenListeners);
                if (window.screen.lockOrientation) {
                    window.screen.lockOrientation('portrait');
                }
                sendMessage('pauseVideo');
            });
            $scope.$watch('url', function(url) {
                $scope.youtubeUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + url + '?enablejsapi=1');
            });
        },
    };
});
