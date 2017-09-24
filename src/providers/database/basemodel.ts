import { DatabaseProvider } from "./database";
import { ApiProvider } from "../api/api";
import { TableDef } from "./table";
import { DBMethod } from "./decorators";

export class BaseModel<T = {}> {
  protected API: ApiProvider;
  protected DB: DatabaseProvider;

  protected readonly table: TableDef;
  protected ready: Promise<boolean>;

  constructor() {}

  initialize() {
    this.ready = this.DB.initializeTable(this.table).then(changed => {
      if (changed)
        return this.update('skipWait');
      return false;
    });
  }

  protected transform(item: T): void {
    // Don't do anything
    return;
  }

  /**
     * Update function.
     * @param  {boolean|string} shouldupdate - `true` if enough time has passed in order to
     *                                       update, `'skipWait'` if the function should skip
     *                                       waiting for the `ready` Promise to resolve
     * @return {Promise}    A promise for when the update is finished. Resolves with true if an update took place.
     */
  async update(shouldupdate: boolean | 'skipWait'): Promise<boolean> {
    if (!this.table.apiMethod) {
      return Promise.reject(`${this.table.name} does not have an apiMethod`);
    }
    if (!shouldupdate) {
      return false;
    }
    if (shouldupdate !== 'skipWait' && await this.ready) {
      return false;
    }

    const data = await this.API[this.table.apiMethod]();
    return this.DB.populateTable(this.table, data);
  }

  @DBMethod
  async getAll(): Promise<T[]> {
    const res = await this.DB.getMultiple(`SELECT * FROM ${this.table.name}`);
    res.forEach(a => this.transform(a));
    return res;
  }

  @DBMethod
  async getOne(id): Promise<T> {
    const res = await this.DB.getSingle(`
        SELECT * FROM ${this.table.name}
        WHERE "${this.table.primary}" = ?
      `, [id]);
    this.transform(res);
    return res;
  }
}
