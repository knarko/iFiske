angular.module('ifiske.models')
.provider('User', function() {
    var tables = {
        info: {
            name:    'User_Info',
            primary: 'ID',
            members: {
                ID:       'int',
                username: 'text',
                loggedin: 'text',
                IP1:      'text',
                IP2:      'text',
                name:     'text',
                email:    'text',
                created:  'text',
            },
        },
        number: {
            name:    'User_Number',
            primary: 'number',
            members: {
                number: 'text',
            },
        },
        favorite: {
            name:    'User_Favorite',
            primary: 'ID',
            members: {
                ID:  'int',
                a:   'int',
                add: 'int',
                not: 'int',
                cnt: 'int',
            },
        },
        product: {
            name:    'User_Product',
            primary: 'ID',
            members: {
                ID:       'int',
                at:       'int',
                code:     'int',
                fr:       'int',
                fullname: 'text',
                ot:       'text',
                ref1:     'int',
                ref2:     'int',
                t:        'text',
                subt:     'text',
                to:       'int',
                pid:      'int',
                pdf:      'text',
                qr:       'text',
                fine:     'text',
            },
        },
    };

    this.$get = function(DB, $q, API, Push, $ionicPlatform, $cordovaToast, sessionData, Product) {
        var p = [];
        for (var table in tables) {
            p.push(DB.initializeTable(tables[table]));
        }
        var wait = $q.all(p).then(function(changed) {
            for (var i = 0; i < changed.length; ++i) {
                if (changed[i])
                    return update('skipWait');
            }
        });

        /**
        * Cleans all the user data from database
        * @return {Promise}  Promise when done
        */
        function clean() {
            var p = [];
            for (var table in tables) {
                p.push(DB.initializeTable(tables[table]));
            }
            return $q.all(p)
            .then(function() {
                console.log('Removed user info from database');
            }, function(err) {
                console.log('Could not remove user data from database!', err);
            });
        }
        function update(shouldUpdate) {
            if (!sessionData.token) {
                return;
            }
            var innerWait = wait;
            if (shouldUpdate === 'skipWait')
                innerWait = $q.resolve();
            return innerWait.then(function() {
                var p = [];
                p.push(API.user_get_favorites().then(function(favorites) {
                    DB.populateTable(tables.favorite, favorites);
                }));
                p.push(API.user_info().then(function(data) {
                    var numbers = data.numbers;
                    var numArr = [];
                    for (var i = 0; i < numbers.length; ++i) {
                        numArr.push({number: numbers[i]});
                    }
                    return $q.all([
                        DB.populateTable(tables.info, [data])
                            .then(function() {
                                return 'User_Info';
                            }, function(err) {
                                console.log(data);
                                console.log(err);
                                return $q.reject(err);
                            }),
                        DB.populateTable(tables.number, numArr)
                            .then(function() {
                                return 'User_Numbers';
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            }),
                    ]);
                }));
                p.push(API.user_products().then(function(products) {
                    DB.populateTable(tables.product, products);
                }));

                return $q.all(p);
            }).catch(function(err) {
                if (err.error_code === 7) {
                    $ionicPlatform.ready(function() {
                        if (window.plugins) {
                            $cordovaToast.show('Du har blivit utloggad', 'short', 'bottom');
                        } else {
                            console.warn('Cannot toast');
                        }
                    });
                    logout();
                    throw err;
                }
            });
        }

        function login(username, password) {
            return API.user_login(username, password)
            .then(update)
            .then(Push.reset);
        }

        function logout() {
            return $q.all([
                clean(),
                API.user_logout(),
                Push.logout(),
            ]);
        }

        return {
            update: update,
            login:  login,
            logout: logout,

            getInfo: function() {
                return wait.then(function() {
                    return DB.getSingle([
                        'SELECT *',
                        'FROM User_Info',
                    ].join(' '));
                });
            },

            getNumbers: function() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT *',
                        'FROM User_Number',
                    ].join(' '));
                });
            },

            getProduct: function(id) {
                // TODO: get license from DB, or from api
                return wait.then(function() {
                    return DB.getSingle([
                        'SELECT User_Product.*, Product.ai,',
                        'Rule.t as rule_t,',
                        'Rule.ver as rule_ver,',
                        'Rule.d as rule_d',
                        'FROM User_Product',
                        'LEFT JOIN Product ON Product.ID = User_Product.pid',
                        'LEFT JOIN Rule ON Rule.ID = Product.ri',
                        'WHERE User_Product.ID = ?',
                    ].join(' '), [id]).then(function(product) {
                        console.log(product);
                        product.validity = Product.getValidity(product);
                        return product;
                    });
                });
            },

            getProducts: function() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT User_Product.*,',
                        'Rule.t as rule_t,',
                        'Rule.ver as rule_ver,',
                        'Rule.d as rule_d',
                        'FROM User_Product',
                        'LEFT JOIN Product ON Product.ID = User_Product.pid',
                        'LEFT JOIN Rule ON Rule.ID = Product.ri',
                    ].join(' ')).then(function(products) {
                        products.forEach(function(product) {
                            console.log(product);
                            product.validity = Product.getValidity(product);
                        });
                        return products;
                    });
                });
            },

            getFavorites: function() {
                return wait.then(function() {
                    return DB.getMultiple([
                        'SELECT *',
                        'FROM User_Favorite',
                        'JOIN Area ON User_Favorite.a = Area.ID',
                    ].join(' '));
                });
            },

            removeFavorite: function(id) {
                return wait.then(function() {
                    return DB.runSql([
                        'DELETE FROM User_Favorite',
                        'WHERE a = ?',
                    ].join(' '), [id]);
                });
            },

            addFavorite: function(id) {
                return wait.then(function() {
                    return DB.runSql([
                        'INSERT INTO User_Favorite',
                        '(a, "not") VALUES (?, 0)',
                    ].join(' '), [id]);
                });
            },

            setFavoriteNotification: function(id, not) {
                return wait.then(function() {
                    return DB.runSql([
                        'UPDATE User_Favorite',
                        'SET "not" = ? WHERE a = ?',
                    ].join(' '), [not, id]);
                });
            },
        };
    };
});
