import { DatabaseProvider } from "./database";
import { ApiProvider } from "../api/api";
import { TableDef } from "./table";
import { DBMethod } from "./decorators";
import { Dictionary } from "../../types";
import { UpdateStrategy } from "../update/update";

export class BaseModel<T = {}> {
  protected API: ApiProvider;
  protected DB: DatabaseProvider;

  protected readonly tables?: Dictionary<TableDef> | TableDef[];

  protected ready: Promise<any>;

  readonly updateStrategy: UpdateStrategy = 'timed';

  constructor() {
  }

  initialize() {
    let tables: TableDef[];
    if (this.tables) {
      tables = Array.isArray(this.tables) ? this.tables : Object.values(this.tables);
    } else {
      this.ready = new Promise(() => {
        throw new Error(`No table definitions found for ${this.toString()}`);
      });
      return;
    }

    this.ready = Promise.all(tables.map(table => this.DB.initializeTable(table))).then(changed => {
      for (let i = 0; i < changed.length; ++i) {
        if (changed[i])
          return this.update(true);
      }
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
  async update(skipReady?: boolean): Promise<boolean> {
    const tables = Array.isArray(this.tables) ? this.tables : Object.values(this.tables);
    return Promise.all(tables.map(async (table) => {
      if (!table.apiMethod) {
        return Promise.reject(`${table.name} does not have an apiMethod`);
      }
      if (!skipReady) {
        await this.ready;
      }
      const data = await this.API[table.apiMethod]();
      await this.DB.populateTable(table, data);
      return true;
    })).then(changed => changed.reduce((acc, curr) => acc || curr, false));

  }

  @DBMethod
  async getAll(): Promise<T[]> {
    const res = await this.DB.getMultiple(`SELECT * FROM ${this.tables[0].name}`);
    res.forEach(a => this.transform(a));
    return res;
  }

  @DBMethod
  async getOne(id): Promise<T> {
    const res = await this.DB.getSingle(`
        SELECT * FROM ${this.tables[0].name}
        WHERE "${this.tables[0].primary}" = ?
      `, [id]);
    this.transform(res);
    return res;
  }
}
