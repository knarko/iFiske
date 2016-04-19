/* global Ionic */
angular.module('ifiske.services')

.factory('Push', [
    '$ionicPlatform',
    '$ionicPush',
    '$timeout',
    'API',
    '$state',
    'sessionData',
    '$ionicPopup',
    '$cordovaInAppBrowser',
    'DB',
    '$q',
    function($ionicPlatform, $ionicPush, $timeout, API, $state, sessionData, $ionicPopup, $cordovaInAppBrowser, DB, $q) {
        var pushHandlers = {
            default: function(notification, payload) {
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
                        title: 'Vill du skapa en fångstrapport?',
                        cancelText: 'Avbryt',
                        okText: 'OK'
                    }).then(function(response) {
                        if (response) {
                            $cordovaInAppBrowser.open('https://ifiske.se/r/' + payload.code, '_system');
                        }
                    });
                    //$state.go('app.create_report', {orgid: payload.orgid, code: payload.code});
                }
            }],

            /*
            * Someone made a report on a area we favorited
            * Payload should contain:
            * RepId: ID of the new report
            */
            NEW_FAV: [function(notification, payload) {
                if (payload && payload.repid) {
                    //$state.go('app.report', {id: payload.repid});
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

        var handleNotification = function(notification) {
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
        };
        $ionicPlatform.ready(function() {
            $ionicPush.init({
                debug: false,
                onNotification: handleNotification,
                onRegister: function(data) {
                    console.log('Registered a push token:', data.token);
                }
            });
        });

        var registerPush = function() {
            return $ionicPush.register(function(token) {
                return $ionicPush.saveToken(token);
            });
        };

        function login(email, password) {
            return $ionicPlatform.ready().then(function() {
                var details = {email: email, password: password};
                console.log('logging in');
                return Ionic.Auth.login('basic', {remember: true}, details).catch(function(errors) {
                    console.log(errors);
                    return Ionic.Auth.signup(details).then(function() {
                        return Ionic.Auth.login('basic', {remember: true}, details);
                    });
                });
            }).then(function() {
                var user = Ionic.User.current();
                return API.user_set_pushtoken(user.id);
            }).catch(function(err) {
                console.error('we got an error!', err);
            });
        }

        function init() {
            if (!sessionData.token) {
                return;
            }
            var user = Ionic.User.current();
            if (user.isAuthenticated()) {
                return registerPush();
            } else {
                var promises = [
                    API.user_info(),
                    API.user_get_secret()
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
            init: init,
            token: function() {
                return Ionic.User.current().id;
            },
            unregister: function() {
                return $ionicPush.unregister().then(function() {
                    return Ionic.Auth.logout();
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
            testNotification: handleNotification
        };
    }
]);
