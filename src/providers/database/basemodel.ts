import { DatabaseProvider } from "./database";
import { ApiProvider } from "../api/api";

export interface DBTable {
    name: string;
    primary: string;
    members: {
      [key: string]: 'int' | 'text' | string;
    };
    apiMethod?: string;
}

export class BaseModel {
  protected API: ApiProvider;
  protected DB: DatabaseProvider;

  protected table: DBTable;
  wait: Promise<void>;

  constructor() {}

  initialize() {
    this.wait = this.DB.initializeTable(this.table).then(changed => {
      if (changed)
        return this.update('skipWait');
    });
  }

  /**
     * Update function.
     * @param  {boolean|string} shouldupdate - `true` if enough time has passed in order to
     *                                       update, `'skipWait'` if the function should skip
     *                                       waiting for the `wait` Promise to resolve
     * @return {Promise}    A promise for when the update is finished
     */
  update(shouldupdate: boolean | 'skipWait') {
    if (!this.table.apiMethod) {
      return Promise.reject(`${this.table.name} does not have an apiMethod`);
    }
    if (shouldupdate) {
      return this.API[this.table.apiMethod]().then(data => {
        if (shouldupdate === 'skipWait')
          return this.DB.populateTable(this.table, data);
        return this.wait.then(() => {
          return this.DB.populateTable(this.table, data);
        });
      });
    }
  }

  getAll() {
    return this.wait.then(() => {
      return this.DB.getMultiple(`
      SELECT * FROM ${this.table.name}
      `);
    });
  }

  getOne(id) {
    return this.wait.then(() => {
      return this.DB.getSingle(`
        SELECT * FROM ${this.table.name}
        WHERE "${this.table.primary}" = ?
      `, [id]);
    });
  }
}
