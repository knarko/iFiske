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

                var populate = function() {
                    return $q.all([
                        API.get_areas()
                        .then(function(data) {
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
                                console.log('Populated Area');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_products()
                        .then(function(data) {
                            return DB.populateTable('Product', data)
                            .then(function() {
                                console.log('Populated Product');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_counties()
                        .then(function(data) {
                            return DB.populateTable('County', data)
                            .then(function() {
                                console.log('Populated County');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_municipalities()
                        .then(function(data) {
                            return DB.populateTable('Municipality', data)
                            .then(function() {
                                console.log('Populated Municipality');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_fishes()
                        .then(function(data) {
                            return DB.populateTable('Fish', data)
                            .then(function() {
                                console.log('Populated Fish');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_rules()
                        .then(function(data) {
                            return DB.populateTable('Rule', data)
                            .then(function() {
                                console.log('Populated Rule');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_techniques()
                        .then(function(data) {
                            return DB.populateTable('Technique', data)
                            .then(function() {
                                console.log('Populated Technique');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_organizations()
                        .then(function(data) {
                            return DB.populateTable('Organization', data)
                            .then(function() {
                                console.log('Populated Organization');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_map_pois()
                        .then(function(data) {
                            return DB.populateTable('Poi', data)
                            .then(function() {
                                console.log('Populated Poi');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_map_poi_types()
                        .then(function(data) {
                            return DB.populateTable('Poi_Type', data)
                            .then(function() {
                                console.log('Populated Poi_Type');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_map_polygons()
                        .then(function(data) {
                            return DB.populateTable('Polygon', data)
                            .then(function() {
                                console.log('Populated Polygon');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        })
                    ]);
                };

                var populateUser = function() {
                    return $q.all([
                        API.user_products()
                        .then(function(data) {
                            console.log(data);
                            return DB.populateTable('User_Product', data)
                            .then(function() {
                                console.log('Populated User_Product');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.user_info()
                        .then(function(data) {
                            var numbers = data.numbers;
                            var numArr = [];
                            for (var i = 0; i < numbers.length; ++i) {
                                numArr.push({'number': numbers[i]});
                            }
                            return $q.all([
                                DB.populateTable('User_Info', [data])
                                .then(function() {
                                    console.log('Populated User_Info');
                                }, function(err) {
                                    console.log(data);
                                    console.log(err);
                                    return $q.reject(err);
                                }),
                                DB.populateTable('User_Number', numArr)
                                .then(function() {
                                    console.log('Populated User_Numbers');
                                }, function(err) {
                                    console.log(err);
                                    return $q.reject(err);
                                }),
                            ]);
                        })
                    ]);
                };

                var cleanUser = function() {
                    return $q.all([
                        DB.cleanTable('User_Product'),
                        DB.cleanTable('User_Number'),
                        DB.cleanTable('User_Info')
                    ])
                    .then(function() {
                        console.log('Removed user info from database');
                    }, function(err) {
                        console.log('Could not remove user data from database!', err);
                    });
                };

                var updateFunc = function(forced) {
                    $ionicLoading.show();

                    var currentTime = Date.now();

                    var lastUpdate = 0;
                    if (!forced) {
                        lastUpdate = localStorage.get(LAST_UPDATE);
                    }

                    var aWeek = 1000 * 3600 * 24 * 7;
                    if (currentTime - lastUpdate > aWeek) {
                        console.log(lastUpdate, currentTime, forced);
                        return $q.all([
                            DB.init()
                            .then(function() {
                                console.log('Initialized DB system');
                                if (sessionData.token) {
                                    return $q.all([
                                        populateUser(),
                                        populate()
                                    ]);
                                } else {
                                    return populate();
                                }
                            })

                            .then(function() {
                                console.log('Populated all the things');
                                localStorage.set(LAST_UPDATE, currentTime);
                                $ionicLoading.hide();
                            }, function(err) {
                                if (err.error_code === 7) {
                                    // Authentication failure
                                    // TODO: Show to user
                                    cleanUser();
                                    API.user_logout();
                                    $ionicLoading.hide();
                                } else {
                                    console.warn('Got an error, will try to recreate all tables:', err);

                                    return DB.clean()
                                    .then(function() {
                                        return DB.init();
                                    })

                                    .then(function() {
                                        return populate();
                                    })

                                    .then(function() {
                                        console.log('Populated all the things');
                                        localStorage.set(LAST_UPDATE, currentTime);
                                        $ionicLoading.hide();
                                    }, function(err) {
                                        console.log('Still error, handle it!', err);
                                        $ionicLoading.hide();
                                    });
                                }
                            }),
                            API.get_terms_of_service()
                            .then(function(data) {
                                localStorage.set('tos', data);
                            }),
                            API.get_sms_terms()
                            .then(function(terms) {
                                localStorage.set('sms_terms', terms);
                            }),
                            API.get_contact_info()
                            .then(function(data) {
                                localStorage.set('contactInfo', data);
                            })
                        ]);

                    } else if (sessionData.token) {
                        return DB.init()
                        .then(function() {
                            console.log('Initialized DB system');
                            if (sessionData.token) {
                                populateUser()
                                .then(function() {
                                    $ionicLoading.hide();
                                }, function(err) {
                                    console.err(err);
                                    $ionicLoading.hide();
                                });
                            }
                            $ionicLoading.hide();
                        });
                    } else {
                        console.log('no_update');
                        $ionicLoading.hide();
                        return $q.when('No update');
                    }
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
            }];
    });
})(window.angular);
