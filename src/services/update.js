(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.update', ['ifiske.api', 'ifiske.db', 'ifiske.utils'])
    .provider('Update', function UpdateProvider() {

        this.$get = [
            'API',
            'DB',
            'localStorage',
            '$q',
            '$ionicLoading',
            'sessionData',
            function(API, DB, localStorage, $q, $ionicLoading, sessionData) {

                var LAST_UPDATE = 'last_update';

                var updates = {
                    auth: [
                        {
                            endpoint: 'user_products',
                            table: 'User_Product',
                        },
                        {
                            endpoint: 'user_get_favorites',
                            table: 'User_Favorite',
                        },
                        {
                            endpoint: 'user_info',
                            table: [
                                'User_Info',
                                'User_Number'
                            ],
                            f: function(data) {
                                var numbers = data.numbers;
                                var numArr = [];
                                for (var i = 0; i < numbers.length; ++i) {
                                    numArr.push({'number': numbers[i]});
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
                            }
                        }
                    ],
                    timed: [
                        {
                            endpoint: 'get_areas',
                            f: function(data) {
                                var fishArr = [];
                                for (var key in data) {
                                    var fishes = data[key].fish;
                                    for (var fishKey in fishes) {
                                        fishArr.push({
                                            'ID': key + '_' + fishKey,
                                            fid: fishKey,
                                            aid: key,
                                            amount: fishes[fishKey][0],
                                            comment: fishes[fishKey][1]
                                        });
                                    }
                                }
                                return $q.all([
                                    DB.populateTable('Area', data),
                                    DB.populateTable('Area_Fish', fishArr)
                                ])
                                .then(function() {
                                    return 'Area';
                                }, function(err) {
                                    console.warn(err);
                                    return $q.reject(err);
                                });
                            }
                        },
                        {
                            endpoint: 'get_products',
                            table: 'Product'
                        },
                        {
                            endpoint: 'get_counties',
                            table: 'County'
                        },
                        {
                            endpoint: 'get_municipalities',
                            table: 'Municipality'
                        },
                        {
                            endpoint: 'get_fishes',
                            table: 'Fish'
                        },
                        {
                            endpoint: 'get_rules',
                            table: 'Rule'
                        },
                        {
                            endpoint: 'get_techniques',
                            table: 'Technique'
                        },
                        {
                            endpoint: 'get_organizations',
                            table: 'Organization'
                        },
                        {
                            endpoint: 'get_map_pois',
                            table: 'Poi'
                        },
                        {
                            endpoint: 'get_map_poi_types',
                            table: 'Poi_Type'
                        },
                        {
                            endpoint: 'get_map_polygons',
                            table: 'Polygon'
                        }
                    ],
                    always: [
                        {
                            endpoint: 'get_content_menu',
                            f: function(data) {
                                localStorage.set('NEWS', data.title);
                                return DB.populateTable('News', data.contents)
                                .then(function() {
                                    return 'News';
                                }, function(err) {
                                    console.warn(err);
                                    return $q.reject(err);
                                });
                            }
                        },
                        {
                            endpoint: 'get_terms_of_service',
                            storage_name: 'tos'
                        },
                        {
                            endpoint: 'get_sms_terms',
                            storage_name: 'sms_terms'
                        },
                        {
                            endpoint: 'get_contact_info',
                            storage_name: 'contactInfo'
                        },
                        {
                            endpoint: 'get_mapbox_api',
                            storage_name: 'mapbox_api'
                        }
                    ]
                };

                var timedUpdate = function(currentTime) {

                    var lastUpdate = localStorage.get(LAST_UPDATE);

                    var aWeek = 1000 * 3600 * 24 * 7;
                    return (currentTime - lastUpdate) > aWeek;
                };

                var populate = function(item) {
                    console.log(item);

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
                                //TODO: what if we need to remake the tables?
                                console.warn(err);
                                return $q.reject(err);
                            });
                        };
                    } else if (item.storage_name) {
                        then = function(data) {
                            return localStorage.set(item.storage_name, data);
                        };
                    }

                    if (then) {
                        return p.then(then);
                    } else {
                        console.error('NO ACTION!');
                    }
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
                    return $q.all(p)
                    .then(function() {
                        console.log('Removed user info from database');
                    }, function(err) {
                        console.log('Could not remove user data from database!', err);
                    });
                };

                var updateFunc = function(forced) {
                    $ionicLoading.show();
                    return $q(function(fulfill, reject) {

                        var promises = [];
                        var currentTime = Date.now();
                        var shouldUpdate = (forced || timedUpdate(currentTime));
                        DB.init()
                        .then(function() {
                            console.log('Initialized DB system');
                            for (var i = 0; i < updates.always.length; ++i) {
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
                                    // Authentication failure
                                    // TODO: Show to user
                                    cleanUser();
                                    API.user_logout();
                                    reject('auth failure');
                                } else {
                                    console.warn('Got an error, recreate all tables:', err);
                                    return DB.clean()
                                    .then(updateFunc);
                                }
                            })
                            .finally(function() {
                                $ionicLoading.hide();
                            });
                        });

                    });
                };

                return {
                    update: function() {
                        return updateFunc();
                    },

                    forcedUpdate: function() {
                        return updateFunc(true);
                    },

                    user_logout: function() {
                        cleanUser();
                        return API.user_logout();
                    },
                    user_login: function(username, password) {
                        return API.user_login(username, password)
                        .then(function() {
                            updateFunc();
                        });
                    },
                    last_update: function() {
                        return localStorage.get(LAST_UPDATE);
                    }
                };
            }
        ];
    });
})(window.angular);
