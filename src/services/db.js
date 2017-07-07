angular.module('ifiske.services')
  .service('DB', function($cordovaSQLite, $q) {
    var db;
    var ready = $q.defer();
    if (window.sqlitePlugin) {
      db = $cordovaSQLite.openDB('fiskebasen.db');
    } else if (window.openDatabase) {
      db = window.openDatabase(
        'fiskebasen.db',
        '',
        'fiskebasen',
        10 * 1024 * 1024,
      );
    } else {
      console.log('Not supported on this device, sorry');
      ready.reject('Not supported');
      return {ready: ready.promise};
    }
    ready.resolve();

    /**
     * Run a sql command
     * @param  {string} sql SQL string to run
     * @param  {array} params parameters to insert into '?' of sql
     * @return {SQL_result}     SQL result
     */
    function runSql(sql, params) {
      return $cordovaSQLite.execute(db, sql, params);
    }

    /**
     * Create an array of objects from a sql result
     * @param  {SQL_result} data Result of an sql query
     * @return {Array}      Array of objects
     */
    function createObject(data) {
      var retval = [];
      for (var i = 0; i < data.rows.length; ++i) {
        retval.push(angular.copy(data.rows.item(i)));
      }
      return retval;
    }

    function clean(table) {
      return runSql('DROP TABLE IF EXISTS ' + table + ';');
    }

    /**
     * Runs a query, returning the selected rows as an array
     * @param  {string} sql  SQL command to execute
     * @param  {array} args Array containing arguments to be inserted with '?'
     * @return {Promise<array>}      Promise of an array with the selected rows
     */
    function getMultiple(sql, args) {
      return $q(function(fulfill, reject) {
        $cordovaSQLite.execute(db, sql, args)
          .then(function(result) {
            if (result.rows.length) {
              fulfill(createObject(result));
            } else {
              reject(
                'Could not find any objects for sql: \n' +
                        sql + '\nWith arguments: \n' +
                        (args ? args.join(',') : ''),
              );
            }
          }, reject);
      });
    }

    /**
     * Runs a query, returning a single selected row
     * @param  {string} sql  SQL command to execute
     * @param  {Array} args Array containing arguments to be inserted wit '?'
     * @return {Promise<Row>}      Promise of a row from the table
     */
    function getSingle(sql, args) {
      return getMultiple(sql, args).then(function(result) {
        return result[0];
      });
    }

    /**
     * Populates a given table with data
     * @param  {table} table The table definition, should be {name: string, primary: string, members: {"column_name": "int|real|boolean|string"}}
     * @param  {Enumerable} data  Object or Array with data to insert, should be contain objects with the same keys as the table columns
     * @return {SQL_results}  Returns SQL results
     */
    function populateTable(table, data) {
      return $q(function(fulfill, reject) {
        db.transaction(function(tx) {
          tx.executeSql('DELETE FROM ' + table.name + ';');

          (Array.isArray(data) ? data : Object.values(data)).forEach(singleData => {
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
          });
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
        return ready.promise.then(function() {
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

          var query = `
          CREATE TABLE IF NOT EXISTS ${table.name} (
            ${tableMembers}
            ${table.primary ? `, PRIMARY KEY(${table.primary})` : ''}
          );`;

          /* Remake the table if the schema has changed */
          return runSql('SELECT sql from sqlite_master where name is "' + table.name + '"')
            .then(function(result) {
              if (!result.rows.length) {
                // There is no table, make it
                return runSql(query);
              }
              var re = /"(\w+)"\s*(\w+)/g;
              var regexResult;
              var oldTable = {};
              while ((regexResult = re.exec(result.rows.item(0).sql))) {
                oldTable[regexResult[1]] = regexResult[2];
              }
              const matched = result.rows.item(0).sql
                .match(/PRIMARY KEY\(\s*"?(\w+)"?\s*\)/i);
              const primaryKey = matched && matched.length > 1 ? matched[1] : undefined;
              if (!angular.equals(table.members, oldTable) || table.primary !== primaryKey) {
                console.log(table.name + ' needs to update since the schema has changed.');
                return clean(table.name).then(function() {
                  return runSql(query);
                });
              }
            });
        });
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
  });
