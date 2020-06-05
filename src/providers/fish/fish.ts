import { Injectable } from '@angular/core';
import * as Fuse from 'fuse.js';

import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';
import { ImgcacheService } from '../../imgcache/imgcache.service';
import { Dictionary } from '../../types';
import { generateSnippet } from '../../util';
import { RegionProvider } from '../region/region';

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

  snippet?: string;
}

@Injectable()
export class FishProvider extends BaseModel<Fish> {
  protected readonly tables: TableDef[] = [
    {
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
        snippet: 'text',
      },
    },
  ];

  constructor(
    protected API: ApiProvider,
    protected DB: DatabaseProvider,
    private imgcache: ImgcacheService,
    private region: RegionProvider,
  ) {
    super();
    this.initialize();
  }

  async update(skipWait?: boolean): Promise<boolean> {
    if (!skipWait) {
      await this.ready;
    }

    const data: Dictionary<Fish> = await this.API.get_fishes();

    for (const fish of Object.values(data)) {
      fish.icon = this.region.serverLocation$.value + fish.icon;
      fish.img = this.region.serverLocation$.value + fish.img;
      fish.snippet = generateSnippet(fish.d);
      this.imgcache.cacheFile(fish.img).catch(() => {});
    }

    await this.DB.populateTable(this.tables[0], data);
    return true;
  }

  async search(searchString): Promise<{ item: Fish }[]> {
    let t0;
    if (performance && performance.now) {
      t0 = performance.now();
    }
    const data = await this.getAll();
    const options = {
      keys: [
        {
          name: 't',
          weight: 0.6,
        },
      ],
      includeScore: true,
      shouldSort: true,
      threshold: 0.01,
      distance: 10,
      maxPatternLength: 16,
    };
    const fuse = new Fuse(data, options);
    if (performance && performance.now) {
      const t1 = performance.now();
      console.log('Searching took:', t1 - t0, 'ms');
    }
    return fuse.search(searchString) as { item: Fish }[];
  }
}
