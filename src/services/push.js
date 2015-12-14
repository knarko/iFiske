/* global Ionic */
angular.module('ifiske.services')

.factory('Push', [
    '$ionicPlatform',
    '$ionicPush',
    '$ionicUser',
    '$timeout',
    'API',
    '$state',
    'sessionData',
    '$ionicPopup',
    function($ionicPlatform, $ionicPush, $ionicUser, $timeout, API, $state, sessionData, $ionicPopup) {
        var pushHandlers = {
            default: function(notification, payload) {
                alert(notification.text);
            },

            /*
            * We got a new fishing license. We will get the Code of the new license
            * Payload should contain:
            * code: fishing license code
            */
            NEW: [function(notification, payload) {
                if (payload && payload.code) {
                    $state.go('app.license_detail', {id: payload.code});
                }
            }],

            /*
            * We got a request to make a fishing report
            * Payload should contain:
            * orgid: organisation id,
            * code: fishing license code,
            */
            REP_REQ: [function(notification, payload) {
                if (payload && payload.orgid && payload.code) {
                    $state.go('app.create_report', {orgid: payload.orgid, code: payload.code});
                }
            }],

            /*
            * Someone made a report on a area we favorited
            * Payload should contain:
            * RepId: ID of the new report
            */
            NEW_FAV: [function(notification, payload) {
                if (payload && payload.repid) {
                    $state.go('app.report', {id: payload.repid});
                }
            }],

            /*
            * Display a message
            * Payload should contain:
            * message: a string that we should Display
            */
            NOTE: [function(notification, payload) {
                if (payload && payload.message) {
                    $ionicPopup.alert(payload.message);
                }
            }]
        };

        $ionicPlatform.ready(function() {
            $ionicPush.init({
                debug: false,
                onNotification: function(notification) {
                    var payload = notification.payload;
                    var i;

                    console.log('Recieved a new push notification', notification, payload);
                    if (payload.action in pushHandlers) {
                        for (i = 0; i < pushHandlers[payload.action].length; ++i) {
                            $timeout(pushHandlers[payload.action][i], 0, true, notification, payload);
                        }
                    } else {
                        pushHandlers.default(notification, payload);
                    }
                },
                onRegister: function(data) {
                    console.log('Registered a push token:', data.token);
                }
            });
        });

        var createNewUser = function() {
            var user = Ionic.User.current();

            if (!user.id) {
                user.id = Ionic.User.anonymousId();
            }
            API.user_set_pushtoken(user.id);
            registerPush();
        };
        var registerPush = function() {
            $ionicPush.register(function(token) {
                var user = Ionic.User.current();
                user.addPushToken(token);
                user.save();
            });
        };

        var init = function() {
            API.user_get_pushtoken().then(function(userId) {
                $ionicPlatform.ready(function() {
                    if (userId) {
                        Ionic.User.load(userId).then(function(loadedUser) {
                            Ionic.User.current(loadedUser);
                            registerPush();
                        }, function(failure) {
                            console.log("Couldn't load user", failure);
                            createNewUser();
                        });
                    } else {
                        createNewUser();
                    }
                });
            });
        };

        if (sessionData.token) {
            init();
        }
        return {
            init: init,
            registerHandler: function(name, handler) {
                if (name === 'default') {
                    return;
                }
                if (!pushHandlers[name]) {
                    pushHandlers[name] = [];
                }
                pushHandlers[name].push(handler);
            }
        };
    }
]);
