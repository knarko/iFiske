import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';
import { DatabaseProvider } from '../database/database';

export interface Bait {
  /** Bait ID */
  ID: number;
  /** The name of the bait */
  t: string;
  /** Preferred sort order */
  so: number;
}

@Injectable()
export class BaitProvider extends BaseModel<Bait> {
  protected readonly tables: TableDef[] = [
    {
      name: 'Bait',
      apiMethod: 'get_baits',
      primary: 'ID',
      members: {
        ID: 'int',
        t: 'text',
        so: 'int',
      },
    },
  ];
  constructor(protected API: ApiProvider, protected DB: DatabaseProvider) {
    super();
    this.initialize();
  }
}
