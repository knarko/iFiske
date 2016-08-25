angular.module('ifiske.services')
.provider('DB', function DBProvider() {
    this.$get = function($cordovaSQLite, $q) {
        var db;
        var ready = $q.defer();
        var version = '5';
        if (window.sqlitePlugin) {
            db = $cordovaSQLite.openDB('fiskebasen.db');
        } else if (window.openDatabase) {
            try {
                db = window.openDatabase(
                    'fiskebasen.db',
                    version,
                    'fiskebasen',
                    10 * 1024 * 1024
                );
                ready.resolve(false);
            } catch (e) {
                if (!db) {
                    db = window.openDatabase(
                        'fiskebasen.db',
                        '',
                        'fiskebasen',
                        10 * 1024 * 1024
                    );
                    db.changeVersion(db.version, version, function() {
                        console.log('updating db from ' + db.version + ' to ' + version);
                        clean().then(function() {
                            ready.resolve(true);
                        });
                    });
                }
            }
        } else {
            console.log('Not supported on this device, sorry');
            ready.reject('Not supported');
            return {ready: ready.promise};
        }

        function runSql(sql) {
            return $cordovaSQLite.execute(db, sql);
        }

        function createObject(data) {
            var retval = [];
            for (var i = 0; i < data.rows.length; ++i) {
                retval.push(angular.copy(data.rows.item(i)));
            }
            return retval;
        }

        function clean() {
            return $q(function(fulfill, reject) {
                db.transaction(
                    function(tx) {
                        for (var table in tableDef) {
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
        }
        function getMultiple(sql, args) {
            return $q(function(fulfill, reject) {
                $cordovaSQLite.execute(db, sql, args)
                .then(function(result) {
                    if (result.rows.length) {
                        fulfill(createObject(result));
                    } else {
                        reject('Could not find any matching objects');
                    }
                }, reject);
            });
        }

        function getSingle(sql, args) {
            return getMultiple(sql, args).then(function(result) {
                return result[0];
            });
        }

        function populateTable(table, data) {
            return $q(function(fulfill, reject) {
                db.transaction(function(tx) {
                    tx.executeSql('DELETE FROM ' + table.name + ';');

                    for (var id in data) {
                        var singleData = data[id];
                        var insertData = [];
                        for (var member in table.members) {
                            insertData.push(singleData[member]);
                        }
                        var query = [
                            'INSERT INTO',
                            table.name,
                            'VALUES(?',
                            ',?'.repeat(insertData.length - 1),
                            ')',
                        ].join(' ');

                        tx.executeSql(query, insertData);
                    }
                }, reject, fulfill);
            });
        }

        return {
            ready: ready.promise,

            clean:       clean,
            getMultiple: getMultiple,
            getSingle:   getSingle,

            runSql: runSql,

            insertHelper: function(table) {
                return function(data) {
                    return populateTable(table, data);
                };
            },

            populateTable: populateTable,

            initializeTable: function(table) {
                /*
                * Builds a string with "" around all names, so that
                * it can be used to create an SQL Table witout having
                * to worry about using reserved keywords.
                */
                var tableMembers = [];
                for (var member in table.members) {
                    if (table.members.hasOwnProperty(member))
                        tableMembers.push('"' + member + '" ' + table.members[member]);
                }
                tableMembers = tableMembers.join(', ');

                var query = [
                    'CREATE TABLE IF NOT EXISTS',
                    table.name,
                    '(',
                    tableMembers,
                    ', PRIMARY KEY(',
                    '"' + table.primary + '"',
                    '));',
                ].join(' ');
                return runSql(query);
            },

            cleanTable: function(table) {
                return $q(function(fulfill, reject) {
                    db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM ' + table + ';');
                    },
                    reject,
                    fulfill);
                });
            },

        };
    };
});
