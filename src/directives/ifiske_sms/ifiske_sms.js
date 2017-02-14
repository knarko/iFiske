angular.module('ngCordovaSms', [])
.directive('ngCordovaSms', function(
    $cordovaSms,
    $ionicPopup,
    $translate,
    $rootScope,
    User,
    analytics
) {
    'use strict';
    return {
        restrict: 'A',
        link:     function(_scope, el, attrs) {
            function showPopup(user) {
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
                    title:    $translate.instant('Type name'),
                    template: '<input ng-model="data.response" type="text">',
                    scope:    scope,
                    buttons:  [{
                        text:  $translate.instant('Cancel'),
                        type:  'button-default',
                        onTap: function() {},
                    }, {
                        text:  $translate.instant('OK'),
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
                        }).then(function() {
                            console.log('Opened SMS application');
                            analytics.trackEvent('Purchase', 'SMS', attrs.ngCordovaSms);
                        });
                    }
                });
            }
            el.on('click', function(e) {
                e.preventDefault();
                User.getInfo()
                .then(showPopup)
                .catch(function() {
                    showPopup({name: ''});
                });
            });
        },
    };
});
