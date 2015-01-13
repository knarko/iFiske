(function(angular, undefined) {
    'use strict';

    angular.module('ifiske.db', [])
    .provider('DB', function DBProvider() {




        this.$get = [ function() {
        var sql = (window.sqlitePlugin ? window.sqlitePlugin : window);
        var DB = sql.openDatabase("fiskebasen", "1.0", "fiskebasen", 10 * 1024 * 1024);


            var db_call = function(input_function) {
                return new Promise(function (fulfill, reject) {
                    input_function(fulfill, reject);
                });

            };

            return {

                /**
                 * Drops all tables in the database
                 * @method clean
                 * @param {Function} callback
                 */
                clean: function(callback) {
                    this.DB.transaction(
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
                    Debug.log,
                    callback
                    );
                },

                /**
                 * Initialies the tables in the database
                 * @method init
                 * @param {Function} callback
                 */
                init: function(){
                    return new Promise(function (fulfill, reject) {
                        DB.transaction(
                            function(tx) {
                            tx.executeSql([
                                'CREATE TABLE IF NOT EXISTS Regions (',
                                'id int, name text, long real, lat real, quantity int,',
                                'PRIMARY KEY (id));',

                                'CREATE TABLE IF NOT EXISTS Areas (',
                                'id int, name text, region_id int, org_id int,long real,',
                                'lat real, description text,',
                                'PRIMARY KEY (id),',
                                'FOREIGN KEY (region_id) REFERENCES Regions(id),',
                                'FOREIGN KEY (org_id) REFERENCES Organisations(id));',

                                'CREATE TABLE IF NOT EXISTS Area_keywords (',
                                'area_id int, keyword text,',
                                'FOREIGN KEY (area_id) REFERENCES Areas(id));',

                                'CREATE TABLE IF NOT EXISTS Products (',
                                'id int, smsdisplay int, vat int, saleschannel int,',
                                'area_id int, name text, price int, rule_id int,',
                                'sortorder int, headline text, important text, notes text,',
                                'smscode text,',
                                'PRIMARY KEY (id),',
                                'FOREIGN KEY (area_id) REFERENCES Areas(id),',
                                'FOREIGN KEY (rule_id) REFERENCES Rules(id));',

                                'CREATE TABLE IF NOT EXISTS Species_areas (',
                                'species_id int, area_id int, cmt text, level int,',
                                'FOREIGN KEY (species_id) REFERENCES Species(id),',
                                'FOREIGN KEY (area_id) REFERENCES Areas(id));',

                                'CREATE TABLE IF NOT EXISTS Species (',
                                'id int, name text, latin text,',
                                'PRIMARY KEY (id));',

                                'CREATE TABLE IF NOT EXISTS Organisations (',
                                'id int, name text, region int, description text,',
                                'homepage text, contact text,',
                                'PRIMARY KEY (id),',
                                'FOREIGN KEY (region) REFERENCES Regions(id));',

                                'CREATE TABLE IF NOT EXISTS Subscriptions (',
                                'id int, title text, product_title text, org_id int,',
                                'rule_id int, area_id int, validFrom int, validTo int,',
                                'fullname text, email text, ref_our int, ref_their int,',
                                'mobile int, code int, pdf_id text, purchased_at int,',
                                'PRIMARY KEY (id));'
                            ].join(' '));
                        },
                        reject,
                        fulfill
                        );
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

            /**
             * Gets information about an area
             * @method getArea
             * @param {Integer} id
             * @param {Function} callback
             */
getArea: function(id, callback) {
             var querySuccess = function(tx, result) {
                 if (result.rows.length == 1) {
                     callback && callback(result.rows.item(0));
                 } else {
                     callback && callback(null);
                 }
             }
             this.DB.transaction(function(tx) {
                     tx.executeSql([
                             'SELECT DISTINCT Areas.*, Organisations.*',
                             'FROM Areas',
                             'JOIN Organisations',
                             'ON Areas.org_id = Organisations.id',
                             'WHERE Areas.id = ?'
                     ].join(' '),
                     [id],
                     querySuccess);
                     }, Debug.log);
         },

         /**
          * Searches the database using a query
          *
          * The query is matched vs area.name and area.keyword
          * @method search
          * @param {String} searchstring
          * @param {Function} callback
          */
search: function(searchstring, callback) {
            var querySuccess = function(tx, results) {
                callback && callback(results);
            };
            this.DB.transaction(function(tx){
                    tx.executeSql([
                            'SELECT id, name',
                            'FROM Areas',
                            'WHERE name LIKE ?',
                            'UNION',
                            'SELECT DISTINCT Areas.id, Areas.name',
                            'FROM Area_keywords',
                            'INNER JOIN Areas ON Areas.id = Area_keywords.area_id',
                            'WHERE Area_keywords.keyword LIKE ?',
                            'ORDER BY name'
                    ].join('\n'),
                    ['%' + searchstring + '%', '%' + searchstring + '%'],
                    querySuccess);
                    },Debug.log);
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
