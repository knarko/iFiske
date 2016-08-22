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

    this.$get = function(DB, $q, API) {
        var p = [];
        for (var table in tables) {
            p.push(DB.initializeTable(tables[table]));
        }
        var wait = $q.all(p);

        return {
            update: function() {
                return wait.then(function() {
                    var p = [];
                    p.push(API.user_get_favorites().then(function(favorites) {
                        DB.populateTableNew(tables.favorite, favorites);
                    }));
                    p.push(API.user_info().then(function(data) {
                        var numbers = data.numbers;
                        var numArr = [];
                        for (var i = 0; i < numbers.length; ++i) {
                            numArr.push({number: numbers[i]});
                        }
                        return $q.all([
                            DB.populateTableNew(tables.info, [data])
                            .then(function() {
                                return 'User_Info';
                            }, function(err) {
                                console.log(data);
                                console.log(err);
                                return $q.reject(err);
                            }),
                            DB.populateTableNew(tables.number, numArr)
                            .then(function() {
                                return 'User_Numbers';
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            }),
                        ]);
                    }));
                    p.push(API.user_products().then(function(products) {
                        DB.populateTableNew(tables.products, products);
                    }));

                    return $q.all(p);
                });
            },

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
                    ].join(' '), [id]);
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
                    ].join(' '));
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
