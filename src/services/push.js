/* global Ionic */
angular.module('ifiske.services')

.factory('Push', [
    '$ionicPlatform',
    '$ionicPush',
    '$ionicUser',
    'API',
    '$state',
    function($ionicPlatform, $ionicPush, $ionicUser, API, $state) {
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
                    $state.go('app.license_detail', {id: payload.code})
                }
            }],

            /*
            * We got a request to make a fishing report
            * Payload should contain:
            * orgid: organisation id,
            * code: fishing license code,
            */
            REP_REQ: [function(notification, payload) {

            }],

            /*
            * Someone made a report on a area we favorited
            * Payload should contain:
            * RepId: ID of the new report
            */
            NEW_FAV: [function(notification, payload) {

            }],

            /*
            * Display a message
            * Payload should contain:
            * message: a string that we should Display
            */
            NOTE: [function(notification, payload) {

            }]
        };

        $ionicPlatform.ready(function() {
            var user = Ionic.User.current();

            if (!user.id) {
                user.id = Ionic.User.anonymousId();
                user.save();
                API.user_add_pushtoken(user);
            }

            $ionicPush.init({
                debug: false,
                onNotification: function(notification) {
                    var payload = notification.payload;
                    var i;

                    if (payload.action in pushHandlers) {
                        console.log(notification, payload);
                        for (i = 0; i < pushHandlers[payload.action].length; ++i) {
                            pushHandlers[payload.action][i](notification, payload);
                        }
                    } else {
                        pushHandlers.default(notification, payload);
                    }
                },
                onRegister: function(data) {
                    console.log(data.token);
                }
            });

            $ionicPush.register(function(token) {
                user.addPushToken(token);
                user.save();
            });
        });
        return {
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
