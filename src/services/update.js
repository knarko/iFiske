angular.module('ifiske.services')
.provider('Update', function UpdateProvider() {
    this.$get = function(
        API,
        DB,
        localStorage,
        $q,
        $ionicLoading,
        sessionData,
        Push,
        $cordovaToast,
        $ionicPlatform,
        Area,
        County,
        Fish,
        MapData,
        Organization,
        News,
        Product,
        Rule,
        Technique,
        Terms,
        User
    ) {
        var LAST_UPDATE = 'last_update';

        var updates = {
            auth: [
                User.update,
            ],
            timed: [
                Area.update,
                County.update,
                Fish.update,
                Product.update,
                Rule.update,
                Organization.update,
                Technique.update,
                MapData.update,
            ],
            always: [
                News.update,
                Terms.update,
            ],
        };

        var timedUpdate = function(currentTime) {
            var lastUpdate = localStorage.get(LAST_UPDATE);

            var aWeek = 1000 * 3600 * 24 * 7;
            return (currentTime - lastUpdate) > aWeek;
        };

        var populate = function(item) {
            if (typeof item === 'function') {
                return item();
            }
            var p = API[item.endpoint]();
            var then;
            if (typeof item.f === 'function') {
                then = item.f;
            } else if (item.storageName) {
                then = function(data) {
                    return localStorage.set(item.storageName, data);
                };
            }

            if (then) {
                return p.then(then);
            }
            // We should never reach this position
            console.error('NO ACTION!');
        };

        var cleanUser = function() {
            // TODO: Add user cleaning to Userfile too
            var p = [];
            p.push(User.clean());
            p.push(Push.unregister());
            return $q.all(p)
            .then(function() {
                console.log('Removed user info from database');
            }, function(err) {
                console.log('Could not remove user data from database!', err);
            });
        };

        var updateFunc = function(forced, hideLoading) {
            return DB.ready.then(function(newDB) {
                forced = newDB || forced;
                if (!hideLoading)
                    $ionicLoading.show();
                return $q(function(fulfill, reject) {
                    var promises = [];
                    var currentTime = Date.now();
                    var shouldUpdate = (forced || timedUpdate(currentTime));
                    var i;
                    for (i = 0; i < updates.always.length; ++i) {
                        promises.push(populate(updates.always[i]));
                    }
                    if (sessionData.token) {
                        for (i = 0; i < updates.auth.length; ++i) {
                            promises.push(populate(updates.auth[i]));
                        }
                    }
                    if (shouldUpdate) {
                        for (i = 0; i < updates.timed.length; ++i) {
                            promises.push(populate(updates.timed[i]));
                        }
                    }

                    $q.all(promises).then(function(stuff) {
                        console.log('Populated:', stuff);
                        if (shouldUpdate) {
                            localStorage.set(LAST_UPDATE, currentTime);
                        }
                        fulfill('Pass');
                    }, function(err) {
                        if (err.error_code === 7) {
                            $ionicPlatform.ready(function() {
                                if (window.plugins) {
                                    $cordovaToast.show('Du har blivit utloggad', 'short', 'bottom');
                                } else {
                                    console.warn('Cannot toast');
                                }
                            });
                            cleanUser();
                            API.user_logout();
                            reject('auth failure');
                        } else {
                            $ionicPlatform.ready(function() {
                                if (window.plugins) {
                                    $cordovaToast.show('Tyvärr kan appen inte komma åt iFiskes server. Är du ansluten till nätverket?', 'long', 'bottom');
                                } else {
                                    console.warn('Cannot toast');
                                }
                            });
                            reject('Couldn\'t update: ' + err.message);
                        }
                    })
                    .finally(function() {
                        $ionicLoading.hide();
                    });
                });
            });
        };

        return {
            update: function(hideLoading) {
                return updateFunc(false, hideLoading);
            },

            forcedUpdate: function(hideLoading) {
                return updateFunc(true, hideLoading);
            },

            /* eslint-disable camelcase */
            user_logout: function() {
                cleanUser();
                return API.user_logout();
            },
            user_login: function(username, password) {
                return API.user_login(username, password)
                .then(function() {
                    return $q.all([updateFunc(), Push.init()]);
                });
            },
            last_update: function() {
                return localStorage.get(LAST_UPDATE);
            },
        };
    };
});
