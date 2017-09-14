import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ApiProvider } from '../api/api';

@Injectable()
export class MapDataProvider {
  wait: Promise<any>;

  private readonly tables = {
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

  constructor(private DB: DatabaseProvider, private API: ApiProvider) {
    this.wait = Promise.all([
      DB.initializeTable(this.tables.poi),
      DB.initializeTable(this.tables.poiType),
      DB.initializeTable(this.tables.polygon),
    ]).then((results) => {
      console.log(results);
      for (var i = 0; i < results.length; ++i) {
        if (results[i])
          return this.update('skipWait');
      }
    });
  }

  update = (shouldUpdate) => {
    console.log(this, shouldUpdate);
    let innerWait = this.wait;
    if (shouldUpdate) {
      if (shouldUpdate === 'skipWait')
        innerWait = Promise.resolve();

      return innerWait.then(() => {
        return Promise.all([
          this.API.get_mapbox_api().then((data) => {
            return localStorage.setItem('mapbox_api', data);
          }),
          this.API.get_map_pois().then(this.DB.insertHelper(this.tables.poi)),
          this.API.get_map_poi_types().then(this.DB.insertHelper(this.tables.poiType)),
          this.API.get_map_polygons().then(this.DB.insertHelper(this.tables.polygon)),
        ]);
      });
    }
  }

    getPois(id) {
      return this.wait.then(function () {
        return this.DB.getMultiple([
          'SELECT *',
          'FROM Poi',
          'WHERE orgid = ?',
        ].join(' '), [id]);
      });
    }

    getPoiTypes() {
      return this.wait.then(function () {
        return this.DB.getMultiple([
          'SELECT *',
          'FROM Poi_Type',
        ].join(' '));
      });
    }

    getPolygons(id) {
      return this.wait.then(function () {
        return this.DB.getMultiple([
          'SELECT *',
          'FROM Polygon',
          'WHERE orgid = ?',
        ].join(' '), [id]);
      });
    }
}
