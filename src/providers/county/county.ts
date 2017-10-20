import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';
import { DBMethod } from '../database/decorators';

export interface County {
  ID: number;
  s: string;
  t: string;
  d: string;
}

@Injectable()
export class CountyProvider extends BaseModel<County> {
  protected readonly table: TableDef = {
    name: 'County',
    apiMethod: 'get_counties',
    primary: 'ID',
    members: {
      ID: 'int',
      s: 'text',
      t: 'text',
      d: 'text',
    },
  };

  constructor(
    protected DB: DatabaseProvider,
    protected API: ApiProvider,
  ) {
    super();
    this.initialize();
  }

  @DBMethod
  async getAll(): Promise<County[]> {
    return this.DB.getMultiple(`
      SELECT DISTINCT County.* FROM County
      WHERE County.ID IN (SELECT Area.c1 FROM Area)
        OR County.ID IN (SELECT Area.c2 FROM Area)
        OR County.ID IN (SELECT Area.c3 FROM Area)
      ORDER BY County.t
    `);
  }

}
