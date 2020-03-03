import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';
import { DBMethod } from '../database/decorators';

export interface Municipality {
  ID: number;
  /** Name of the municipality */
  name: string;
  /** ID of the County in which this municipality is located */
  cID: number;
  /** Title */
  t: string;
  /** Description (html) */
  desc: string;
  /** Link to the municipality's own homepage */
  url: string;
  /** Link to logotype at iFiske's server, may be empty */
  logo?: string;
}

@Injectable()
export class MunicipalityProvider extends BaseModel<Municipality> {
  protected readonly tables: TableDef[] = [
    {
      name: 'Municipality',
      apiMethod: 'get_municipalities',
      primary: 'ID',
      members: {
        ID: 'int',
        name: 'text',
        cID: 'int',
        t: 'text',
        desc: 'text',
        url: 'text',
        logo: 'text',
      },
    },
  ];

  constructor(protected DB: DatabaseProvider, protected API: ApiProvider) {
    super();
    this.initialize();
  }

  @DBMethod
  async getAll(countyId?: number) {
    return this.DB.getMultiple(
      `
      SELECT Municipality.*
      FROM Municipality
      WHERE cID = ?
      `,
      [countyId],
    );
  }
}
