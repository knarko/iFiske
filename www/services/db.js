(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.db', [])
    .provider('DB', function DBProvider() {

        this.$get = [ '$cordovaSQLite', 'API', '$q', function($cordovaSQLite, API, $q) {


            var db;
            if (window.sqlitePlugin) {
                db = $cordovaSQLite.openDB('fiskebasen.db');
            } else if (window.openDatabase) {
                db = window.openDatabase('fiskebasen.db', '1.0', 'fiskebasen', 10*1024*1024);
            } else {
                console.log('Not supported on this device, sorry');
                return undefined;
            }


            var tableDef = {
                'Area': [
                    ['ID',    'int'],
                    ['t',     'text'],
                    ['kw',    'text'],
                    ['note',  'text'],
                    ['c1',    'int'],
                    ['c2',    'int'],
                    ['c3',    'int'],
                    ['m1',    'int'],
                    ['m2',    'int'],
                    ['m3',    'int'],
                    ['lat',   'real'],
                    ['lng',   'real'],
                    ['zoom',  'text'],
                    ['pnt',   'int'],
                    ['car',   'int'],
                    ['eng',   'int'],
                    ['hcp',   'int'],
                    ['map',   'text'],
                    ['wsc',   'int'],
                    ['mod',   'int'],
                    ['d',     'text']
                ],
                'Product': [
                    ['ID',     'int'],
                    ['t',      'text'],
                    ['t2',     'text'],
                    ['no',     'text'],
                    ['im',     'text'],
                    ['pf',     'text'],
                    ['ai',     'int'],
                    ['ri',     'int'],
                    ['ch',     'int'],
                    ['price',  'int'],
                    ['mod',    'int'],
                    ['so',     'int'],
                    ['hl',     'text']
                ],
                'County': [
                    ['ID',  'int'],
                    ['s',   'text'],
                    ['t',   'text'],
                    ['d',   'text']
                ],
                'Municipality': [
                    ['ID',    'int'],
                    ['cID',   'int'],
                    ['name',  'text']
                ],
                'Fish': [
                    ['ID',    'int'],
                    ['t',     'text'],
                    ['d',     'text'],
                    ['mod',   'int'],
                    ['so',    'int'],
                    ['max',   'int'],
                    ['icon',  'text'],
                    ['img',   'text'],
                    ['in',    'text'],
                    ['geo',   'text'],
                    ['size',  'text'],
                    ['lat',   'text'],
                    ['rec',   'text']
                ],
                'Rule': [
                    ['ID',   'int'],
                    ['ver',  'int'],
                    ['d',    'text'],
                    ['t',    'text']
                ],
                'User_Product': [
                    ['ID',        'int'],
                    ['at',        'int'],
                    ['code',      'int'],
                    ['fr',        'int'],
                    ['fullname',  'text'],
                    ['ot',        'text'],
                    ['ref1',      'int'],
                    ['ref2',      'int'],
                    ['t',         'text'],
                    ['to',        'int']
                ]

            };

            var createObject = function(data) {
                var retval = [];
                for(var i = 0; i < data.rows.length; ++i) {
                    retval.push(data.rows.item(i));
                }
                return retval;
            };

            var populateTable = function(table, data) {
                return $q(function (fulfill, reject) {
                    db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM ' + table + ';');

                        for (var id in data) {
                            var singleData = data[id];
                            var insertData = [];
                            for (var i = 0; i < tableDef[table].length; ++i) {
                                insertData.push(singleData[tableDef[table][i][0]]);
                            }
                            var query = [
                                'INSERT INTO',
                                table,
                                'VALUES(?',
                                ',?'.repeat(insertData.length-1),
                                ')'].join(' ');

                                tx.executeSql(query, insertData);
                        }
                    },
                    reject,
                    fulfill);
                });

            };


            return {

                /**
                 * Drops all tables in the database
                 * @method clean
                 */
                clean: function() {
                    return $q(function (fulfill, reject) {
                        db.transaction(
                            function(tx) {
                                for(var table in tableDef){
                                    tx.executeSql('DROP TABLE IF EXISTS ' + table + ';');
                                }
                            },
                            reject,
                            fulfill
                        );
                    })
                    .then(function() {
                        console.log('Removed all tables');
                    });
                },

                /**
                 * Initialies the tables in the database
                 * @method init
                 */
                init: function(){
                    return $q(function(fulfill, reject) {
                        db.transaction( function (tx) {
                            for(var table in tableDef) {
                                var query = [
                                    'CREATE TABLE IF NOT EXISTS',
                                    table,
                                    '(',
                                    '"' + tableDef[table].join('___"').split(',').join('" ').split('___').join(', '),
                                    ', PRIMARY KEY(',
                                    '"' + tableDef[table][0][0] + '"',
                                    '));'
                                ].join(' ');
                                tx.executeSql(query);
                            }
                        },
                        reject,
                        fulfill);
                    });
                },

                populate: function() {
                    return $q.all([
                        API.get_areas()
                        .then(function(data) {
                            return populateTable('Area', data.data.response);
                        })
                        .then(function() {
                            console.log('Populated Area');
                        }, function(err) {
                            console.log(err);
                            return $q.reject(err);
                        }),
                        API.get_products()
                        .then(function(data) {
                            return populateTable('Product', data.data.response)
                            .then(function() {
                                console.log('Populated Product');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_counties()
                        .then(function(data) {
                            return populateTable('County', data.data.response)
                            .then(function() {
                                console.log('Populated County');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_municipalities()
                        .then(function(data) {
                            return populateTable('Municipality', data.data.response)
                            .then(function() {
                                console.log('Populated Municipality');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_fishes()
                        .then(function(data) {
                            return populateTable('Fish', data.data.response)
                            .then(function() {
                                console.log('Populated Fish');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.get_rules()
                        .then(function(data) {
                            return populateTable('Rule', data.data.response)
                            .then(function() {
                                console.log('Populated Rule');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        }),
                        API.user_products()
                        .then(function(data) {
                            return populateTable('User_Product', data.data.response)
                            .then(function() {
                                console.log('Populated User_Product');
                            }, function(err) {
                                console.log(err);
                                return $q.reject(err);
                            });
                        })
                    ]);
                },


                /**
                 * Gets information about an area
                 * @method getArea
                 * @param {Integer} id
                 */
                getArea: function(id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM Area',
                            'WHERE id = ?'
                        ].join(' '), [id])
                        .then( function (data) {
                            fulfill(createObject(data)[0]);
                        }, reject);
                    });
                },

                /**
                 * Searches the database using a query
                 *
                 * The query is matched to a name and/or keyword
                 * @method search
                 * @param {String} searchstring
                 */
                search: function(searchstring, county_id) {
                    return $q( function (fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM Area',
                            'WHERE t LIKE ?',
                            (county_id ? 'AND c1 = ?':''),
                            'ORDER BY t'
                        ].join(' '),
                        county_id ? ['%' + searchstring + '%', county_id]:['%' + searchstring + '%'])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                /**
                 * Gets information about a product
                 * @method getProduct
                 * @param {Integer} product_id
                 */
                getProduct: function(product_id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT DISTINCT *',
                            'FROM Product',
                            'WHERE ID = ?'
                        ].join(' '),
                        [product_id])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                /**
                 * Gets all products from an area
                 * @method getProductsByArea
                 * @param {Integer} area_id
                 */
                getProductsByArea: function(area_id) {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT DISTINCT Product.*,',
                            'Rule.t as rule_t,',
                            'Rule.ver as rule_ver,',
                            'Rule.d as rule_d',
                            'FROM Product',
                            'JOIN Rule ON Rule.ID = Product.ri',
                            'WHERE ai = ?',
                            'ORDER BY so'
                        ].join(' '),
                        [area_id])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                getCounties: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT DISTINCT County.*',
                            'FROM County',
                            'JOIN Area ON Area.c1 = County.ID',
                            'ORDER BY County.t'
                        ].join(' '))
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                getUserProducts: function() {
                    return $q(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT * FROM User_Product'
                        ].join(' '))
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                }

            };
        }];
    });
})(window.angular);
