/* global Ionic */
angular.module('ifiske.push', [])

.factory('Push', [
    '$ionicPlatform',
    '$ionicPush',
    '$ionicUser',
    'API',
    function($ionicPlatform, $ionicPush, $ionicUser, API) {
        var pushHandlers = {
            default: function(notification, payload) {
                alert(notification.text);
            }
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
