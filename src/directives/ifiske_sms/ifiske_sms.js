angular.module('ngCordovaSms', [])
.directive('ngCordovaSms', ['$cordovaSms', '$ionicPopup', 'DB', '$rootScope', function($cordovaSms, $ionicPopup, DB, $rootScope) {
    'use strict';
    return {
        restrict: 'A',
        link:     function(scope, el, attrs) {
            var showPopup = function(user) {
                var scope = $rootScope.$new();
                if (!user || !user.name) {
                    user = {
                        name: '',
                    };
                }
                scope.data = {
                    response: user.name,
                };
                $ionicPopup.show({
                    title:    'Skriv in ditt namn',
                    template: '<input ng-model="data.response" type="text">',
                    scope:    scope,
                    buttons:  [{
                        text:  'Avbryt',
                        type:  'button-default',
                        onTap: function() {},
                    }, {
                        text:  'OK',
                        type:  'button-positive',
                        onTap: function() {
                            return scope.data.response || '';
                        },
                    }],
                }).then(function(name) {
                    if (name) {
                        var message = 'FISKA ' + attrs.ngCordovaSms + ' ' + name;
                        console.log('before sending sms', $cordovaSms);
                        $cordovaSms.send('72456', message, {
                            android: {
                                intent: 'INTENT',
                            },
                        }, function() {
                            console.log('Opened SMS application');
                        }, function(err) {
                            console.log(err);
                        });
                    }
                });
            };
            el.on('click', function(e) {
                e.preventDefault();
                DB.getUserInfo()
                .then(showPopup)
                .catch(function() {
                    showPopup({name: ''});
                });
            });
        },
    };
}]);
