angular.module('ngCordovaSms', [])
.directive('ngCordovaSms', ['$cordovaSms', '$ionicPopup', function($cordovaSms, $ionicPopup) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('click', function(e) {
                e.preventDefault();
                $ionicPopup.prompt({
                    title: 'Skriv in ditt namn',
                    inputType: 'text'
                }).then(function(name) {
                    var message = 'FISKA ' + attrs.ngCordovaSms + ' ' + name;
                    $cordovaSms.send('72456', message, 'INTENT', function() {
                        console.log('succuess');
                    }, function(err) {
                        console.log(err);
                    });
                });
            });
        }
    };
}]);
