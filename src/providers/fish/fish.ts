import { Injectable } from '@angular/core';
import * as ImgCache from 'imgcache.js';
import * as Fuse from 'fuse.js';

import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { serverLocation } from '../api/serverLocation';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';


export interface Fish {
  ID: number;
  t: string;
  d: string;
  mod: number;
  so: number;
  max: number;
  icon: string;
  in: string;
  geo: string;
  img: string;
  size: string;
  lat: string;
  rec: string;
}

@Injectable()
export class FishProvider extends BaseModel<Fish> {
  protected readonly table: TableDef = {
    name: 'Fish',
    primary: 'ID',
    members: {
      ID: 'int',
      t: 'text',
      d: 'text',
      mod: 'int',
      so: 'int',
      max: 'int',
      icon: 'text',
      img: 'text',
      in: 'text',
      geo: 'text',
      size: 'text',
      lat: 'text',
      rec: 'text',
    },
  };

  constructor(
    protected API: ApiProvider,
    protected DB: DatabaseProvider,
  ) {
    super();
    this.initialize();
  }

  async update(shouldUpdate): Promise<boolean> {
    if (!shouldUpdate) {
      return false;
    }
    let data = this.API.get_fishes();
    if (shouldUpdate !== 'skipWait' && await this.ready) {
      return false;
    }

    data = await data;
    console.log('Downloading all fish images');
    for (const fish of Object.values(data)) {
      fish.icon = serverLocation + fish.icon;
      fish.img = serverLocation + fish.img;
      ImgCache.cacheFile(fish.img);
    }
    return this.DB.populateTable(this.table, data).then(() => true);
  }

  async search(searchString): Promise<{ item: Fish }[]> {
    let t0;
    if (performance && performance.now) {
      t0 = performance.now();
    }
    const data = await this.getAll();
    const options = {
      keys: [{
        name: 't',
        weight: 0.6,
      }],
      includeScore: true,
      shouldSort: true,
      threshold: 0.01,
      distance: 10,
      maxPatternLength: 16,
    };
    const fuse = new Fuse(data, options);
    if (performance && performance.now) {
      const t1 = performance.now();
      console.log('Searching took:', (t1 - t0), 'ms');
    }
    return fuse.search(searchString) as { item: Fish }[];
  }

}
