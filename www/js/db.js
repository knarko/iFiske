String.prototype.repeat = function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
};
var katt;
(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.db', [])
    .provider('DB', function DBProvider() {

        this.$get = [ '$cordovaSQLite', function($cordovaSQLite) {

            if (window.sqlitePlugin) {
                var db = $cordovaSQLite.openDB('fiskebasen.db');
            } else if (window.openDatabase) {
                var db = window.openDatabase('fiskebasen.db', '1.0', 'fiskebasen', 10*1024*1024);
            } else {
                console.log('Not supported on this device, sorry');
            }

            var createObject = function(data) {
                var retval = [];
                for(var i = 0; i < data.rows.length; ++i) {
                    retval.push(data.rows.item(i));
                }
                return retval;
            };

            return {
                db: db,

                /**
                 * Drops all tables in the database
                 * @method clean
                 * @param {Function} callback
                 */
                clean: function() {
                    return new Promise(function (fulfill, reject) {
                        db.transaction(
                            function(tx) {
                            tx.executeSql('DROP TABLE IF EXISTS Regions');
                            tx.executeSql('DROP TABLE IF EXISTS Areas');
                            tx.executeSql('DROP TABLE IF EXISTS Area_keywords');
                            tx.executeSql('DROP TABLE IF EXISTS Products');
                            tx.executeSql('DROP TABLE IF EXISTS Species_areas');
                            tx.executeSql('DROP TABLE IF EXISTS Species');
                            tx.executeSql('DROP TABLE IF EXISTS Organisations');
                            tx.executeSql('DROP TABLE IF EXISTS Subscriptions');
                        },
                        reject,
                        fulfill
                        );
                    });
                },

                /**
                 * Initialies the tables in the database
                 * @method init
                 * @param {Function} callback
                 */
                init: function(){
                    return new Promise(function(fulfill, reject) {
                        db.transaction( function (tx) {
                            tx.executeSql([
                                'CREATE TABLE IF NOT EXISTS Area (',
                                'ID int, t text, kw text, note text, c1 int, c2 int, c3 int,',
                                'm1 int, m2 int, m3 int, lat real, lng real, zoom text, pnt int,',
                                'car int, eng int, hcp int, map text, wsc int, mod int, d text,',
                                'PRIMARY KEY (ID))'
                            ].join('\n'));
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
                               'CREATE TABLE IF NOT EXISTS Product (',
                               'id int, smsdisplay int, vat int, saleschannel int,',
                               'area_id int, name text, price int, rule_id int,',
                               'sortorder int, headline text, important text, notes text,',
                               'smscode text,',
                               'PRIMARY KEY (id),',
                               'FOREIGN KEY (area_id) REFERENCES Areas(id),',
                               'FOREIGN KEY (rule_id) REFERENCES Rules(id))'
                               ].join('\n'));

                               tx.executeSql([
                               'CREATE TABLE IF NOT EXISTS Species_area (',
                               'species_id int, area_id int, cmt text, level int,',
                               'FOREIGN KEY (species_id) REFERENCES Species(id),',
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

                /**
                 * inserts values into a table
                 *
                 * TODO: Create better link between the parsing and this function,
                 * they are highly dependant on each other.
                 * @method updateTable
                 * @param {String} table
                 * A string containing the name of the table to update, corresponding to a
                 * key name in tableDefinition
                 * @param {Array} dataset
                 * An array of arrays, each containing all the values to insert to a row
                 * @param {Function} callback
                 */
                updateTable: function(table, dataset, callback){
                    var query = 'INSERT INTO ';
                    var successCallback = function(){
                        callback && callback();
                    };
                    if (this.tableDefinition[table]) {
                        query += table + ' (' + this.tableDefinition[table] + ') VALUES (?'
                        + Array(this.tableDefinition[table].length).join(',?') + ');';
                    } else {
                        throw Error('Not yet implemented');
                    }

                    this.DB.transaction(function(tx){
                        for(var i in dataset){
                            tx.executeSql(query, dataset[i]);
                        }
                    }, Debug.log, successCallback);
                },

                insertArea: function(areaData) {
                    return new Promise(function (fulfill, reject) {
                        db.transaction(function(tx) {
                            tx.executeSql('DELETE FROM Area;');

                            for (var aid in areaData) {
                                var area = areaData[aid];
                                var insertArea = [
                                    area.ID,
                                    area.t,
                                    area.kw,
                                    area.note,
                                    area.c1,
                                    area.c2,
                                    area.c3,
                                    area.m1,
                                    area.m2,
                                    area.m3,
                                    area.lat,
                                    area.lng,
                                    area.zoom,
                                    area.pnt,
                                    area.car,
                                    area.eng,
                                    area.hcp,
                                    area.map,
                                    area.wsc,
                                    area.mod,
                                    area.d
                                ];
                                var query = 'INSERT INTO Area VALUES(?' + ',?'.repeat(insertArea.length-1) + ')';

                                tx.executeSql(query, insertArea);
                            }
                        },
                        reject,
                        fulfill);
                    });

                },

                /**
                 * Gets information about an area
                 * @method getArea
                 * @param {Integer} id
                 * @param {Function} callback
                 */
                getArea: function(id) {
                    return new Promise(function(fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM Area',
                            'WHERE id = ?'
                        ].join(' '), [id])
                        .then( function (data) {
                            katt = data;
                            fulfill(createObject(data)[0]);
                        }, reject);
                    });
                },

                /**
                 * Searches the database using a query
                 *
                 * The query is matched vs area.name and area.keyword
                 * @method search
                 * @param {String} searchstring
                 * @param {Function} callback
                 */
                search: function(searchstring) {
                    return new Promise( function (fulfill, reject) {
                        $cordovaSQLite.execute(db, [
                            'SELECT *',
                            'FROM Area',
                            'WHERE t LIKE ?',
                            'ORDER BY t'
                        ].join('\n'),
                        ['%' + searchstring + '%'])
                        .then(function(data) {
                            fulfill(createObject(data));
                        }, reject);
                    });
                },

                /**
                 * Gets information about a product
                 * @method getProductById
                 * @param {Integer} product_id
                 * @param {Function} callback
                 */
                getProductById: function(product_id, callback) {
                    var querySuccess = function(tx, results) {
                        var result = null;
                        if (results.rows.length == 1) {
                            result = results.rows.item(0);
                        }
                        callback && callback(result);
                    };
                    this.DB.transaction(function(tx) {
                        tx.executeSql([
                            'SELECT DISTINCT *',
                            'FROM Products',
                            'WHERE id = ?'
                        ].join('\n'),
                        [product_id],
                        querySuccess);
                    }, Debug.log);
                },

                /**
                 * Gets all products from an area
                 * @method getProductsByArea
                 * @param {Integer} area_id
                 * @param {Function} callback
                 */
                getProductsByArea: function(area_id, callback) {
                    var querySuccess = function(tx, results) {
                        if (results.rows.length != 0)
                            callback && callback(results);
                    };
                    this.DB.transaction(function(tx) {
                        tx.executeSql([
                            'SELECT DISTINCT *',
                            'FROM Products',
                            'WHERE area_id = ?',
                            'ORDER BY sortorder'
                        ].join('\n'),
                        [area_id],
                        querySuccess);
                    }, Debug.log);
                },

                /**
                 * Gets all subscriptions
                 * @method getSubscriptions
                 * @param {Function} callback
                 */
                getSubscriptions: function(callback) {
                    var querySuccess = function(tx, results) {
                        if (results.rows.length != 0)
                            callback && callback(results);
                    };
                    this.DB.transaction(function(tx) {
                        tx.executeSql([
                            'SELECT Areas.name, Subscriptions.*',
                            'FROM Subscriptions',
                            'JOIN Areas',
                            'ON Areas.id = Subscriptions.area_id'
                        ].join('\n'),
                        [],
                        querySuccess);
                    }, Debug.log);
                },

                /**
                 * Gets information about a Subscription
                 * @method getSubscriptionByid
                 * @param {Integer} uid
                 * @param {Function} callback
                 */
                getSubscriptionByid: function(uid, callback) {
                    var querySuccess = function(tx, results) {
                        if (results.rows.length == 1)
                            callback && callback(results.rows.item(0));
                    };
                    this.DB.transaction(function(tx) {
                        tx.executeSql([
                            'SELECT *',
                            'FROM Subscriptions',
                            'WHERE id = ?;'
                        ].join('\n'),
                        [uid],
                        querySuccess);
                    }, Debug.log);
                }
            };
        }];
    });
})(window.angular);
