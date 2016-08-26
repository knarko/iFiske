angular.module('ifiske.services')

.factory('Push', function(
    $ionicPlatform,
    $ionicAuth,
    $ionicPush,
    $ionicUser,
    $rootScope,
    $timeout,
    API,
    $state,
    sessionData,
    $ionicPopup,
    $cordovaInAppBrowser,
    $q
) {
    var pushHandlers = {
        default: function(notification) {
            $ionicPopup.alert(notification.text);
        },

        /*
        * We got a new fishing license. We will get the Code of the new license
        * Payload should contain:
        * code: fishing license code
        */
        NEW: [function(_notification, payload) {
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
        REP_REQ: [function(_notification, payload) {
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
        NEW_FAV: [function(_notification, payload) {
            if (payload && payload.repid) {
                // $state.go('app.report', {id: payload.repid});
            }
        }],

        /*
        * Display a message
        * Payload should contain:
        * message: a string that we should Display
        */
        NOTE: [function(_notification, payload) {
            if (payload && payload.message) {
                $ionicPopup.alert(payload.message);
            }
        }],
    };

    function handleNotification(notification) {
        var payload = notification.additionalData.payload;
        var i;

        console.log('Push: Recieved a new push notification', notification, payload);
        if (payload.action in pushHandlers) {
            for (i = 0; i < pushHandlers[payload.action].length; ++i) {
                $timeout(pushHandlers[payload.action][i], 0, true, notification, payload);
            }
        } else {
            pushHandlers.default(notification, payload);
        }
    }
    $ionicPlatform.ready(function() {
        $rootScope.$on('cloud:push:notification', handleNotification);
        $rootScope.$on('cloud:push:register', function(data) {
            console.log('Registered a push token:', data.token);
        });
    });

    function registerPush() {
        console.log('Push: Registering for push notifications');
        return $ionicPlatform.ready().then(function() {
            return $ionicPush.register(function(token) {
                return $ionicPush.saveToken(token);
            });
        });
    }

    function login(email, password) {
        return $ionicPlatform.ready().then(function() {
            var details = {email: email, password: password};
            return $ionicAuth.login('basic', details, {remember: true}).catch(function(errors) {
                console.warn('Push: errors on logging in:', errors);
                if (errors && errors.response && errors.response.statusCode === 401) {
                    return $ionicAuth.signup(details).then(function() {
                        return $ionicAuth.login('basic', details, {remember: true});
                    });
                }
                return errors;
            });
        }).then(function() {
            $ionicUser.save();
            console.log($ionicUser);
            console.log('Push: Sending userID to iFiske servers');
            return API.user_set_pushtoken($ionicUser.id);
        }).catch(function(err) {
            console.error('Push: we got an error!', err);
        });
    }

    function init() {
        if (!sessionData.token) {
            console.log('Push: No token, not initializing push notifications');
            return;
        }
        if ($ionicAuth.isAuthenticated() && !$ionicUser.isAnonymous()) {
            return registerPush();
        }
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
    init();

    return {
        init:  init,
        token: function() {
            return $ionicUser.id;
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
});
