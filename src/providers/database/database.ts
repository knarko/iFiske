import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import isEqual from 'lodash/isEqual';
import { TableDef } from './table';
import { Platform } from 'ionic-angular';

@Injectable()
export class DatabaseProvider {
  ready: Promise<void>;
  private db: SQLiteObject;
  constructor(private sqlite: SQLite, private plt: Platform) {
    this.ready = this.plt.ready().then(() => {
      return this.sqlite.create({
        name: 'fiskebasen.db',
        location: 'default',
      });
    }).catch(err => {
      if ((window as any).openDatabase) {
        let db = (window as any).openDatabase(
          'fiskebasen.db',
          '',
          'fiskebasen',
          10 * 1024 * 1024,
        );
        // tslint:disable-next-line:only-arrow-functions
        db.executeSql = function executeSql(statement, params) {
          return new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql(statement, params, (itx, res) => {
                resolve(res);
              }, (itx, err) => {
                reject(err);
              });
            });
          });
        };
        const trans: Function = db.transaction;
        // tslint:disable-next-line:only-arrow-functions
        db.transaction = function transaction(tx) {
          return new Promise((resolve, reject) => {
            trans.apply(db, [tx, reject, resolve]);
          });
        }
        return Promise.resolve(db);
      } else {
        return Promise.reject(err);
      }
    }).then(db => {
      this.db = db;
      return db;
    });
  }

  /**
   * Run a sql command
   * @param  {string} sql SQL string to run
   * @param  {array} params parameters to insert into '?' of sql
   * @return {SQL_result}     SQL result
   */
  runSql(sql: string, params?) {
    let a = this.db.executeSql(sql, params);
    return a;
  }

  /**
   * Create an array of objects from a sql result
   * @param  {SQL_result} data Result of an sql query
   * @return {Array}      Array of objects
   */
  createObject(data) {
    var retval = [];
    for (var i = 0; i < data.rows.length; ++i) {
      retval.push(Object.assign({}, data.rows.item(i)));
    }
    return retval;
  }

  clean(table) {
    return this.runSql('DROP TABLE IF EXISTS ' + table + ';');
  }

  /**
   * Runs a query, returning the selected rows as an array
   * @param  {string} sql  SQL command to execute
   * @param  {array} args Array containing arguments to be inserted with '?'
   * @return {Promise<array>}      Promise of an array with the selected rows
   */
  getMultiple(sql: string, args?): Promise<any[]> {
    return this.db.executeSql(sql, args)
      .then(result => {
        if (result.rows.length) {
          return Promise.resolve(this.createObject(result));
        } else {
          console.warn(
            `Could not find any objects for sql:
            ${sql}
            With arguments:`,
            args,
          );
          return Promise.resolve([]);
        }
      });
  }

  /**
   * Runs a query, returning a single selected row
   * @param  {string} sql  SQL command to execute
   * @param  {Array} args Array containing arguments to be inserted wit '?'
   * @return {Promise<Row>}      Promise of a row from the table
   */
  getSingle(sql: string, args?: any[]) {
    return this.getMultiple(sql, args).then(result => {
      if (!result || !result.length) {
        throw new Error(`Could not find any objects for '${sql}'`);
      }
      return result[0];
    });
  }

  /**
   * Populates a given table with data
   * @param  {table} table The table definition, should be {name: string, primary: string, members: {"column_name": "int|real|boolean|string"}}
   * @param  {Enumerable} data  Object or Array with data to insert, should be contain objects with the same keys as the table columns
   * @return {SQL_results}  Returns SQL results
   */
  populateTable(table: TableDef, data, shouldDelete = true) {
    return this.db.transaction(tx => {
      if (shouldDelete) {
        tx.executeSql('DELETE FROM ' + table.name + ';');
      }

      (Array.isArray(data) ? data : Object.values(data)).forEach(singleData => {
        var insertData = [];
        for (var member in table.members) {
          /*
          * We need to remove some line separators because of a bug in cordova
          * See https://github.com/litehelpers/Cordova-sqlite-storage/issues/147
          */
          const escapedData = ('' + singleData[member]).replace(/[\u2028\u2029]/g, '\n');
          insertData.push(escapedData);
        }
        var query = `INSERT OR IGNORE INTO ${table.name} VALUES(${Array(insertData.length).fill('?').join(',')})`;
        tx.executeSql(query, insertData);
      });
    });
  }

  insertHelper(table) {
    return data => {
      return this.populateTable(table, data);
    };
  }

  initializeTable(table: TableDef) {
    return this.ready.then(() => {
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

      var query = `
        CREATE TABLE IF NOT EXISTS ${table.name} (
          ${tableMembers.join(', ')}
          ${table.primary ? `, PRIMARY KEY(${table.primary})` : ''}
        );`;

      /* Remake the table if the schema has changed */
      return this.runSql('SELECT sql from sqlite_master where name is "' + table.name + '"')
        .then((result) => {
          if (!result.rows.length) {
            // There is no table, make it
            return this.runSql(query);
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
          if (!isEqual(table.members, oldTable) || table.primary !== primaryKey) {
            console.log(table.name + ' needs to update since the schema has changed.');
            return this.clean(table.name).then(() => {
              return this.runSql(query);
            });
          }
        });
    });
  }

  cleanTable(table: string) {
    return this.db.transaction(tx => {
      tx.executeSql('DELETE FROM ' + table + ';');
    });
  }


}
