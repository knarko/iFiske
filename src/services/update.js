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
        ImgCache
    ) {
        var LAST_UPDATE = 'last_update';

        var updates = {
            auth: [
                {
                    endpoint: 'user_products',
                    table:    'User_Product',
                },
                {
                    endpoint: 'user_get_favorites',
                    table:    'User_Favorite',
                },
                {
                    endpoint: 'user_info',
                    table:    [
                        'User_Info',
                        'User_Number',
                    ],
                    f: function(data) {
                        var numbers = data.numbers;
                        var numArr = [];
                        for (var i = 0; i < numbers.length; ++i) {
                            numArr.push({number: numbers[i]});
                        }
                        return $q.all([
                            DB.populateTable('User_Info', [data])
                            .then(function() {
                                return 'User_Info';
                            }, function(err) {
                                console.log(data);
                                console.log(err);
                                return $q.reject(err);
                            }),
                            DB.populateTable('User_Number', numArr)
                            .then(function() {
                                return 'User_Numbers';
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            }),
                        ]);
                    },
                },
            ],
            timed: [
                {
                    endpoint: 'get_areas',
                    f:        function(data) {
                        var fishArr = [];
                        var photoArr = [];
                        for (var key in data) {
                            var fishes = data[key].fish;
                            for (var fishKey in fishes) {
                                fishArr.push({
                                    ID:      key + '_' + fishKey,
                                    fid:     fishKey,
                                    aid:     key,
                                    amount:  fishes[fishKey][0],
                                    comment: fishes[fishKey][1],
                                });
                            }
                            var photos = data[key].imgs;
                            if (photos) {
                                for (var i = 0; i < photos.length; ++i) {
                                    photoArr.push({
                                        ID:  key + '_' + i,
                                        aid: key,
                                        url: photos[i],
                                    });
                                }
                            } else {
                                console.log(key);
                            }
                        }
                        return $q.all([
                            DB.populateTable('Area', data),
                            DB.populateTable('Area_Fish', fishArr),
                            DB.populateTable('Area_Photos', photoArr),
                        ])
                        .then(function() {
                            return 'Area';
                        }, function(err) {
                            console.warn(err);
                            return $q.reject(err);
                        });
                    },
                },
                {
                    endpoint: 'get_products',
                    table:    'Product',
                },
                {
                    endpoint: 'get_counties',
                    table:    'County',
                },
                {
                    endpoint: 'get_municipalities',
                    table:    'Municipality',
                },
                {
                    endpoint: 'get_fishes',
                    f:        function(data) {
                        var image_endpoint = 'https://www.ifiske.se'; // eslint-disable-line camelcase
                        console.log('Downloading all fish images: ', data);
                        for (var fish in data) {
                            ImgCache.cacheFile(image_endpoint + data[fish].img); // eslint-disable-line camelcase
                        }
                        return DB.populateTable('Fish', data)
                        .then(function() {
                            return 'Fish';
                        }, function(err) {
                            console.warn(err);
                            return $q.reject(err);
                        });
                    },
                },
                {
                    endpoint: 'get_rules',
                    table:    'Rule',
                },
                {
                    endpoint: 'get_techniques',
                    table:    'Technique',
                },
                {
                    endpoint: 'get_organizations',
                    table:    'Organization',
                },
                {
                    endpoint: 'get_map_pois',
                    table:    'Poi',
                },
                {
                    endpoint: 'get_map_poi_types',
                    table:    'Poi_Type',
                },
                {
                    endpoint: 'get_map_polygons',
                    table:    'Polygon',
                },
            ],
            always: [
                {
                    endpoint: 'get_content_menu',
                    f:        function(data) {
                        localStorage.set('NEWS', data.title);
                        return DB.populateTable('News', data.contents)
                        .then(function() {
                            return 'News';
                        }, function(err) {
                            console.warn(err);
                            return $q.reject(err);
                        });
                    },
                },
                {
                    endpoint:    'get_terms_of_service',
                    storageName: 'tos',
                },
                {
                    endpoint:    'get_sms_terms',
                    storageName: 'sms_terms',
                },
                {
                    endpoint:    'get_contact_info',
                    storageName: 'contactInfo',
                },
                {
                    endpoint:    'get_mapbox_api',
                    storageName: 'mapbox_api',
                },
            ],
        };

        var timedUpdate = function(currentTime) {
            var lastUpdate = localStorage.get(LAST_UPDATE);

            var aWeek = 1000 * 3600 * 24 * 7;
            return (currentTime - lastUpdate) > aWeek;
        };

        var populate = function(item) {
            var p = API[item.endpoint]();
            var then;
            if (typeof item.f === 'function') {
                then = item.f;
            } else if (item.table) {
                then = function(data) {
                    return DB.populateTable(item.table, data)
                    .then(function() {
                        return item.table;
                    }, function(err) {
                        // TODO: what if we need to remake the tables?
                        console.warn(err);
                        return $q.reject(err);
                    });
                };
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
            var p = [];
            for (var i = 0; i < updates.auth.length; ++i) {
                if (Array.isArray(updates.auth[i].table)) {
                    for (var j = 0; j < updates.auth[i].table.length; ++j) {
                        p.push(DB.cleanTable(updates.auth[i].table[j]));
                    }
                } else {
                    p.push(DB.cleanTable(updates.auth[i].table));
                }
            }
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
                    DB.init()
                    .then(function() {
                        console.log('Initialized DB system');
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
