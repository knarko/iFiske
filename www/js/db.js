String.prototype.repeat = function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
};
(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.db', [])
    .provider('DB', function DBProvider() {

        this.$get = [ '$cordovaSQLite', 'API', '$q', function($cordovaSQLite, API, $q) {

            if (window.sqlitePlugin) {
                var db = $cordovaSQLite.openDB('fiskebasen.db');
            } else if (window.openDatabase) {
                var db = window.openDatabase('fiskebasen.db', '1.0', 'fiskebasen', 10*1024*1024);
            } else {
                console.log('Not supported on this device, sorry');
            }


            var tableDef = {
                'Area': [
                    'ID',
                    't',
                    'kw',
                    'note',
                    'c1',
                    'c2',
                    'c3',
                    'm1',
                    'm2',
                    'm3',
                    'lat',
                    'lng',
                    'zoom',
                    'pnt',
                    'car',
                    'eng',
                    'hcp',
                    'map',
                    'wsc',
                    'mod',
                    'd'
                ],
                'Product': [
                    'ID',
                    't',
                    't2',
                    'no',
                    'im',
                    'pf',
                    'ai',
                    'ri',
                    'ch',
                    'price',
                    'mod',
                    'dp',
                    'so',
                    'hl'
                ],
                'County': [
                    'ID',
                    's',
                    't',
                    'd'
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
                return new Promise(function (fulfill, reject) {
                    db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM ' + table + ';');

                        for (var id in data) {
                            var singleData = data[id];
                            var insertData = [];
                            for (var i = 0; i < tableDef[table].length; ++i) {
                                insertData.push(singleData[tableDef[table][i]]);
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
                    return new Promise(function (fulfill, reject) {
                        db.transaction(
                            function(tx) {
                            for(var table in tableDef){
                                tx.executeSql('DROP TABLE IF EXISTS ' + table + ';');
                            }
                        },
                        reject,
                        fulfill
                        );
                    });
                },

                /**
                 * Initialies the tables in the database
                 * @method init
                 */
                init: function(){
                    return new Promise(function(fulfill, reject) {
                        db.transaction( function (tx) {
                            tx.executeSql([
                                'CREATE TABLE IF NOT EXISTS Area (',
                                'ID int, t text, kw text, note text, c1 int, c2 int, c3 int,',
                                'm1 int, m2 int, m3 int, lat real, lng real, zoom text, pnt int,',
                                'car int, eng int, hcp int, map text, wsc int, mod int, d text,',
                                'PRIMARY KEY (ID));'
                            ].join(' '));

                            tx.executeSql([
                                'CREATE TABLE IF NOT EXISTS Product (',
                                'ID int, t text, t2 text, no text, im text, pf text, ai int, ri int,',
                                'ch int, price int, mod int, dp int, so int, hl text,',
                                'PRIMARY KEY (ID));'
                            ].join(' '));

                            tx.executeSql([
                                'CREATE TABLE IF NOT EXISTS County (',
                                'ID int, s text, t text, d text,',
                                'PRIMARY KEY(ID));'
                            ].join(' '));
                            /*
                               tx.executeSql([
                               'CREATE TABLE IF NOT EXISTS Region (',
                               'id int, name text, long real, lat real, quantity int,',
                               'PRIMARY KEY (id))'
                               ].join('\n'));

                               tx.executeSql([
                               'CREATE TABLE IF NOT EXISTS Area_keyword (',
                               'area_id int, keyword text,',
                               'FOREIGN KEY (area_id) REFERENCES Areas(id))'
                               ].join('\n'));

                               tx.executeSql([
                               'CREATE TABLE IF NOT EXISTS Species_area (',
                               'species_id int, area_id int, cmt text, level int,',
                               'FOREIGN KEY (species_id) REFERENCES Species(id),'Vilket som skulle kunna vara,
                               'FOREIGN KEY (area_id) REFERENCES Areas(id))'
                               ].join('\n'));

                               tx.executeSql([
                               'CREATE TABLE IF NOT EXISTS Specie (',
                               'id int, name text, latin text,',
                               'PRIMARY KEY (id))'
                               ].join('\n'));

                               tx.executeSql([
                               'CREATE TABLE IF NOT EXISTS Organisation (',
                               'id int, name text, region int, description text,',
                               'homepage text, contact text,',
                               'PRIMARY KEY (id),',
                               'FOREIGN KEY (region) REFERENCES Regions(id))'
                               ].join('\n'));

                               tx.executeSql([
                               'CREATE TABLE IF NOT EXISTS Subscription (',
                               'id int, title text, product_title text, org_id int,',
                               'rule_id int, area_id int, validFrom int, validTo int,',
                               'fullname text, email text, ref_our int, ref_their int,',
                               'mobile int, code int, pdf_id text, purchased_at int,',
                               'PRIMARY KEY (id))'
                               ].join('\n'));
                               */
                        },
                        reject,
                        fulfill);
                    });
                },

                populate: function() {
                    return $q.all(
                        API.get_areas()
                        .success(function(data) {
                            populateTable('Area', data.data.response)
                            .then(function() {
                                console.log('Populated Area');
                            }, function(err) {
                                console.log(err)
                            });
                        }),
                        API.get_products()
                        .success(function(data) {
                            populateTable('Product', data.data.response)
                            .then(function() {
                                console.log('Populated Product');
                            }, function(err) {
                                console.log(err);
                            });
                        }),
                        API.get_counties()
                        .success(function(data) {
                            populateTable('County', data.data.response)
                            .then(function() {
                                console.log('Populated County');
                            }, function(err) {
                                console.log(err);
                            });
                        })

                    );
                },


                /**
                 * Gets information about an area
                 * @method getArea
                 * @param {Integer} id
                 */
                getArea: function(id) {
                    return new Promise(function(fulfill, reject) {
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
                    return new Promise( function (fulfill, reject) {
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
                    return new Promise(function(fulfill, reject) {
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
                    return new Promise(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT DISTINCT *',
                            'FROM Product',
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
                    return new Promise(function(fulfill, reject) {
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
                }
            };
        }];
    });
})(window.angular);
