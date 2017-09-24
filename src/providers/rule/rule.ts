import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { TableDef } from '../database/table';

export interface Rule {
  ID: number;
  ver: number;
  d: string;
  t: string;
}
@Injectable()
export class RuleProvider extends BaseModel<Rule> {
  protected readonly table: TableDef = {
    name:      'Rule',
    apiMethod: 'get_rules',
    primary:   'ID',
    members:   {
      ID:  'int',
      ver: 'int',
      d:   'text',
      t:   'text',
    },
  };

  constructor(
    protected API: ApiProvider,
    protected DB: DatabaseProvider,
  ) {
    super();
    this.initialize();
  }
}
