import { Injectable } from '@angular/core';

import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';
import { serverLocation } from '../api/serverLocation';
import { TableDef } from '../database/table';

export interface Organization {
  /** Organization ID at iFiske */
  ID: number;
  /** Title */
  t: string;
  /** Description (html) */
  d: string;
  /** A text describing the public contact person(s) for this organization (html) */
  cp: string;
  /** Homepage */
  url: string;
  /** County ID */
  co: number;
  /** Last modification date as unix timestamp */
  mod: number;
  /**
   * VAT Policy
   * If 0, do not display that prices are inkluding VAT. Otherwise, indicates the VAT percentage (swedish moms)
   */
  vat: number;
  /**
   * Product display policy flag
   * This is a flag that says if information about how to purchase this item
   * through a premium SMS should be visible also on the web. Some
   * organizations want to hide the SMS purchase option on the web page, since
   * they prefer to sell through the web which gives a better provision.
   */
  dp: number;
  /** If 1, this organization is connected to Sveriges fiskevattenägarförbund */
  fva: number;
  /** Swedish public organization ID (organisationsnummer) */
  org: number;
  /**
   * Multilanguage flag
   * if 1, this organization has data in other languages than swedish
   */
  ml: number;
  /** Path to a logotype, relative to the server base url */
  logo: string;
  /**
   * Organisation type (0-7)
   *
   * 0: Fishing area (In Swedish, “Fiskevårdsområdesförening”)
   * 1: Community association (In Swedish, “Samfällighetsförening”)
   * 2: Fishing club / Association (In Swedish, “Fiskeklubb / Förening”)
   * 3: Company (In Swedish, “Företag”)
   * 4: Non-profit Association (In Swedish, “Idell Förening”)
   * 5: Authority (In Swedish, “Myndighet”)
   * 6: Village community (In Swedish, “Byalag”)
   * 7: Other (In Swedish, “Annan ”)
   */
  ot: number;
  /**
   * Flag, if 1, this organisation applies the “Kontrollavgift” according to
   * the swedish “Lagen (1981:533) om fiskevårdsområden (SFS 2010:1874)”
   */
  fee: number;
  /**
   * Catch report policy flag.
   * 0 = Optional (Default and standard)
   * 1 = Mandatory (But not enforced)
   * 2 = OFF
   * 3 = Mandatory (And enforced)
   * Note: If OFF, catch reports should not be displayed nor gathered for this organisation.
   */
  crp: number;
  /**
   * If bigger than 0, to what sub-division of Sveriges Fiskevattenägarförbund
   * this organisation belongs (association / “lokalförbund”)
   */
  as: number;
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
        ot: 'int',
        fee: 'int',
        crp: 'int',
        as: 'int',
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
