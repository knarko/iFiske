import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';
import { Dictionary } from '../../types';
import { DBMethod } from '../database/decorators';

export interface POI {
  ID: Number;
  orgid: number;
  type: number;
  price: number;
  t: string;
  d: string;
  la: number;
  lo: number;
}

export interface FiskePolygon {
  ID: number;
  orgid: number;
  t: string;
  c: string;
  ver: number;
  mod: number;
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

  constructor(
    protected DB: DatabaseProvider,
    protected API: ApiProvider,
  ) {
    super();
    this.initialize();
  }

  async update(skipWait?: boolean): Promise<boolean> {
    if (!skipWait) {
      await this.ready;
    }

    return Promise.all([
      this.API.get_mapbox_api().then((data) => {
        return localStorage.setItem('mapbox_api', data);
      }),
      this.API.get_map_pois().then(this.DB.insertHelper(this.tables.poi)),
      this.API.get_map_poi_types().then(this.DB.insertHelper(this.tables.poiType)),
      this.API.get_map_polygons().then(this.DB.insertHelper(this.tables.polygon)),
    ])
      .then(() => true);
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
