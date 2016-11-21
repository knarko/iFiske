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
    Settings,
    serverLocation,
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
                        $cordovaInAppBrowser.open(serverLocation + '/r/' + payload.code, '_system');
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

    /*
    Flow of push notifications:
    1. Register with Ionic Cloud
    2. Get settings from Ionic Cloud
    Note: Do we want to persist all settings to cloud? We might want to keep some settings only on certain devices (push for example)
    3. Check if the user has enabled push notifications
    4. Enable/Disable push notifications

    Enabling:
    1. Register a push token with ionic
    2. Send the Ionic User ID to API servers

    Disabling:
    1. Unregister the push token with IonicCloud
    2. Tell API servers that we no longer want push notifications (how? we need a new API route)
    */

    var handleNotification = function(notification) {
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
    };
    $ionicPlatform.ready(function() {
        $rootScope.$on('cloud:push:notification', handleNotification);
        $rootScope.$on('cloud:push:register', function(data) {
            console.log('Registered a push token:', data.token);
        });
    });

    var startPush = function() {
        if (Settings.push()) {
            console.log('Push: Registering for push notifications');
            return $ionicPlatform.ready().then(function() {
                return $ionicPush.register(function(token) {
                    return $ionicPush.saveToken(token);
                });
            });
        }
        // Unregister push
        if (!$ionicPush.token) {
            return $q.resolve('No tokens to unregister');
        }
        // $ionicPush returns a non-$q-promise, so we need to wrap it.
        console.log('Unregistering push tokens');
        return $q.when($ionicPush.unregister());
    };

    function logout() {
        // TypeError in Ionic Cloud that we have to catch
        try {
            return $q.when($ionicPush.unregister())
            .finally(function() {
                return $ionicAuth.logout();
            });
        } finally {
            return $ionicAuth.logout();
        }
    }

    function login(email, password) {
        return $ionicPlatform.ready().then(function() {
            var details = {email: email, password: password};
            return $ionicAuth.login('basic', details, {remember: true}).catch(function(errors) {
                console.warn('Push: errors on logging in:', errors);
                if (errors && errors.response && errors.response.statusCode === 401) {
                    return $ionicAuth.signup(details).then(function() {
                        return $ionicAuth.login('basic', details, {remember: true});
                    }, function(err) {
                        console.log(err);
                        if (err && err.details && err.details.indexOf('conflict_email') !== -1) {
                            // alert('There was an error logging in, please contact ifiske');
                        }
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
            return startPush();
        }
        var promises = [
            API.user_info(),
            API.user_get_secret(),
        ];
        return $q.all(promises).then(function(userInfo) {
            var email = userInfo[0].email;
            var password = userInfo[1];
            return login(email, password).then(function() {
                return startPush();
            });
        });
    }

    return {
        init:  init,
        token: function() {
            return $ionicUser.id;
        },
        reset: function() {
            return startPush();
        },
        logout:          logout,
        registerHandler: function(name, handler) {
            if (name === 'default') {
                return;
            }
            if (!pushHandlers[name]) {
                pushHandlers[name] = [];
            }
            pushHandlers[name].push(handler);
        },
    };
});
