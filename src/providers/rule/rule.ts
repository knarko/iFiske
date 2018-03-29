import { Injectable } from '@angular/core';
import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { TableDef } from '../database/table';
import { LinkyPipe } from '../../pipes/linky/linky';
import striptags from 'striptags';

export interface Rule {
  ID: number;
  ver: number;
  d: string;
  t: string;
}
@Injectable()
export class RuleProvider extends BaseModel<Rule> {
  protected readonly tables: TableDef[] = [
    {
      name: 'Rule',
      apiMethod: 'get_rules',
      primary: 'ID',
      members: {
        ID: 'int',
        ver: 'int',
        d: 'text',
        t: 'text',
      },
    },
  ];

  constructor(protected API: ApiProvider, protected DB: DatabaseProvider) {
    super();
    this.initialize();
  }

  linky = new LinkyPipe();
  transform(rule: Rule) {
    rule.d = this.linky.transform(striptags(rule.d, ['br', 'p', 'h2', 'h3', 'a']));
  }
}
