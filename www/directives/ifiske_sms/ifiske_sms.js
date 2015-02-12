angular.module('ngCordovaSms', [])
.directive('ngCordovaSms', ['$cordovaSms', function($cordovaSms) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function(e) {
                var message = 'FISKA' + attrs.ngCordovaSms + ' Förnamn Efternamn';
                $cordovaSms.send('72456', message, 'INTENT', function() {
                    console.log('succuess');
                }, function(err) {
                    console.log(err);
                });
                e.preventDefault();
            });
        }
    };
}]);
