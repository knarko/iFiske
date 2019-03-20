import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';
import { Dictionary } from '../../types';
import { DBMethod } from '../database/decorators';

export interface POI {
  ID: Number;
  /** Organization ID */
  orgid: number;
  /** POI type ID */
  type: number;
  /** Price of this POI (HTML) in SEK. */
  price: number;
  /** Title */
  t: string;
  /** Description (HTML) */
  d: string;
  /** Latitude */
  la: number;
  /** Longitude */
  lo: number;
}

export interface FiskePolygon {
  ID: number;
  orgid: number;
  /** Title */
  t: string;
  /**
   * The color of the polygon in RRGGBB hexadecimal format.
   *
   * The polygon shall be painted in this color with:
   * - 15% fill color opacity
   * - 80% stroke color opacity
   */
  c: string;
  /** Revision */
  ver: number;
  /** Last modification date in unix timestamp format */
  mod: number;
  /**
   * The actual polygon, formatted as follows:
   * [57.793227,14.578428],[57.791950,14.568944],[57.799272,14.563578],[57.814701,14.563580],[57.814805,14.569119],[57.800507,14.578258]
   * These are Longitude,Latitude-points. The last points connects to the first in the list, forming a closed polygon.
   */
  poly: string;
}

@Injectable()
export class MapDataProvider extends BaseModel {
  protected readonly tables: Dictionary<TableDef> = {
    poi: {
      name: 'Poi',
      primary: 'ID',
      members: {
        ID: 'int',
        orgid: 'int',
        type: 'int',
        price: 'int',
        t: 'text',
        d: 'text',
        la: 'real',
        lo: 'real',
      },
    },
    poiType: {
      name: 'Poi_Type',
      primary: 'ID',
      members: {
        ID: 'int',
        t: 'text',
        icon: 'text',
      },
    },
    polygon: {
      name: 'Polygon',
      primary: 'ID',
      members: {
        ID: 'int',
        orgid: 'int',
        t: 'text',
        c: 'text',
        ver: 'int',
        mod: 'int',
        poly: 'text',
      },
    },
  };

  constructor(protected DB: DatabaseProvider, protected API: ApiProvider) {
    super();
    this.initialize();
  }

  async update(skipWait?: boolean): Promise<boolean> {
    if (!skipWait) {
      await this.ready;
    }

    return Promise.all([
      this.API.get_mapbox_api().then(data => {
        return localStorage.setItem('mapbox_api', data);
      }),
      this.API.get_map_pois().then(data => this.DB.populateTable(this.tables.poi, data)),
      this.API.get_map_poi_types().then(data => this.DB.populateTable(this.tables.poiType, data)),
      this.API.get_map_polygons().then(data => this.DB.populateTable(this.tables.polygon, data)),
    ]).then(() => true);
  }

  @DBMethod
  async getPois(id): Promise<POI[]> {
    return this.DB.getMultiple(`SELECT * FROM Poi WHERE orgid = ?`, [id]);
  }

  @DBMethod
  async getPoiTypes(): Promise<any> {
    return this.DB.getMultiple(`SELECT * FROM Poi_Type`);
  }

  @DBMethod
  async getPolygons(id): Promise<FiskePolygon[]> {
    return this.DB.getMultiple(`SELECT * FROM Polygon WHERE orgid = ?`, [id]);
  }
}
