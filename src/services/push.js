angular.module('ifiske.services')

.factory('Push', [
    '$ionicPlatform',
    '$ionicAuth',
    '$ionicPush',
    '$ionicUser',
    '$ionicEventEmitter',
    '$timeout',
    'API',
    '$state',
    'sessionData',
    '$ionicPopup',
    '$cordovaInAppBrowser',
    'DB',
    '$q',
    function($ionicPlatform, $ionicAuth, $ionicPush, $ionicUser, $ionicEventEmitter, $timeout, API, $state, sessionData, $ionicPopup, $cordovaInAppBrowser, DB, $q) {
        var pushHandlers = {
            default: function(notification) {
                $ionicPopup.alert(notification.text);
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
                    $ionicPopup.confirm({
                        title:      'Vill du skapa en fångstrapport?',
                        cancelText: 'Avbryt',
                        okText:     'OK',
                    }).then(function(response) {
                        if (response) {
                            $cordovaInAppBrowser.open('https://ifiske.se/r/' + payload.code, '_system');
                        }
                    });
                    // $state.go('app.create_report', {orgid: payload.orgid, code: payload.code});
                }
            }],

            /*
            * Someone made a report on a area we favorited
            * Payload should contain:
            * RepId: ID of the new report
            */
            NEW_FAV: [function(notification, payload) {
                if (payload && payload.repid) {
                    // $state.go('app.report', {id: payload.repid});
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
            }],
        };

        var handleNotification = function(notification) {
            var payload = notification.additionalData.payload;
            var i;

            console.log('Recieved a new push notification', notification, payload);
            if (payload.action in pushHandlers) {
                for (i = 0; i < pushHandlers[payload.action].length; ++i) {
                    $timeout(pushHandlers[payload.action][i], 0, true, notification, payload);
                }
            } else {
                pushHandlers.default(notification, payload);
            }
        };
        $ionicPlatform.ready(function() {
            $ionicPush.init({
                debug: false,
            });
            $ionicEventEmitter.on('push:notification', handleNotification);
            $ionicEventEmitter.on('push:register', function(data) {
                console.log('Registered a push token:', data.token);
            });
        });

        var registerPush = function() {
            console.log('Registering push!');
            return $ionicPlatform.ready().then(function() {
                return $ionicPush.register(function(token) {
                    return $ionicPush.saveToken(token);
                });
            });
        };

        function login(email, password) {
            return $ionicPlatform.ready().then(function() {
                var details = {email: email, password: password};
                console.log('logging in');
                return $ionicAuth.login('basic', {remember: true}, details).catch(function(errors) {
                    console.log('errors on logging in:', errors);
                    if (errors && errors.response && errors.response.statusCode === 401) {
                        return $ionicAuth.signup(details).then(function() {
                            return $ionicAuth.login('basic', {remember: true}, details);
                        });
                    } else {
                        return errors;
                    }
                });
            }).then(function() {
                var user = $ionicUser.current();
                user.save();
                console.log('Sending userID to iFiske servers');
                return API.user_set_pushtoken(user.id);
            }).catch(function(err) {
                console.error('we got an error!', err);
            });
        }

        function init() {
            if (!sessionData.token) {
                console.log('No token, not initializing push notifications');
                return;
            }
            var user = $ionicUser.current();
            if (user.isAuthenticated() && !user.isAnonymous()) {
                return registerPush();
            } else {
                var promises = [
                    API.user_info(),
                    API.user_get_secret(),
                ];
                return $q.all(promises).then(function(userInfo) {
                    var email = userInfo[0].email;
                    var password = userInfo[1];
                    return login(email, password).then(function() {
                        return registerPush();
                    });
                });
            }
        }
        init();

        return {
            init:  init,
            token: function() {
                return $ionicUser.current().id;
            },
            unregister: function() {
                // $ionicPush returns a non-$q-promise, so we need to wrap it.
                return $q.when($ionicPush.unregister()).finally(function() {
                    return $ionicAuth.logout();
                });
            },
            registerHandler: function(name, handler) {
                if (name === 'default') {
                    return;
                }
                if (!pushHandlers[name]) {
                    pushHandlers[name] = [];
                }
                pushHandlers[name].push(handler);
            },
            testNotification: handleNotification,
        };
    },
]);
