angular.module('systemBrowser', [])
.directive('globalSystemBrowser', ['$cordovaInAppBrowser', function($cordovaInAppBrowser) {
    'use strict';
    return {
        restrict: 'A',
        link:     function(scope, el, attrs) {
            el.on('click', function(e) {
                if (e.target.href && e.target.host !== window.location.host) {
                    $cordovaInAppBrowser.open(e.target.href, '_system');
                    e.preventDefault();
                }
            });
        },
    };
}]);
