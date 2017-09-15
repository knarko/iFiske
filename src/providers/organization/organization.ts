import { Injectable } from '@angular/core';

import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';

@Injectable()
export class OrganizationProvider extends BaseModel {
  protected readonly table = {
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
  };
  constructor(
    protected DB: DatabaseProvider,
    protected API: ApiProvider,
  ) {
    super();
    this.initialize();
  }
}
