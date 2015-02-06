angular.module('ngCordovaSms', [])
.directive('ngCordovaSms', ['$cordovaSms', function($cordovaSms) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function(e) {
                console.log(attrs);
                var message = 'FISKA XXX Gustav Bylund';
                $cordovaSms.send('0730262686', message, 'INTENT', function() {
                    console.log('succuess');
                }, function(err) {
                                console.log(err)
                });
                e.preventDefault();
            });
        }
    }
}]);
