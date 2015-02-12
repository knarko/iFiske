angular.module('inAppBrowser', [])
.directive('ngInAppBrowser', ['$cordovaInAppBrowser', function($cordovaInAppBrowser) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function(e) {
                $cordovaInAppBrowser.open(el[0].href, '_system');
                e.preventDefault();
            });
        }
    };
}]);
