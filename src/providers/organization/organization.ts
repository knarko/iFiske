import { Injectable } from '@angular/core';

import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';
import { serverLocation } from '../api/serverLocation';
import { TableDef } from '../database/table';

export interface Organization {
  ID: number;
  t: string;
  d: string;
  cp: string;
  url: string;
  co: number;
  mod: number;
  vat: number;
  dp: number;
  fva: number;
  org: number;
  ml: number;
  logo: string;
}

@Injectable()
export class OrganizationProvider extends BaseModel<Organization> {
  protected readonly tables: TableDef[] = [
    {
      name: 'Organization',
      apiMethod: 'get_organizations',
      primary: 'ID',
      members: {
        ID: 'int',
        t: 'text',
        d: 'text',
        cp: 'text',
        url: 'text',
        co: 'int',
        mod: 'int',
        vat: 'int',
        dp: 'int',
        fva: 'int',
        org: 'int',
        ml: 'int',
        logo: 'text',
      },
    },
  ];

  constructor(protected DB: DatabaseProvider, protected API: ApiProvider) {
    super();
    this.initialize();
  }

  protected transform(org: Organization) {
    org.logo = org.logo ? serverLocation + '/' + org.logo : org.logo;
  }
}
