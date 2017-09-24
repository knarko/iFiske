import { Injectable } from '@angular/core';
import * as ImgCache from 'imgcache.js';
import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { TableDef } from '../database/table';

export interface InformationArticle {
  ID: number;
  t: string;
  text: string;
  img: string;
  icon: string;
}

@Injectable()
export class InformationProvider extends BaseModel<InformationArticle> {
  protected readonly table: TableDef = {
    name: 'Information',
    primary: 'ID',
    members: {
      ID: 'int',
      t: 'text',
      text: 'text',
      img: 'text',
      icon: 'text',
    },
  };

  constructor(
    protected API: ApiProvider,
    protected DB: DatabaseProvider,
  ) {
    super();
    this.initialize();
  }

  async update(shouldupdate: boolean | 'skipWait'): Promise<boolean> {
    // Always update
    const data = await this.API.get_content_menu();
    if (shouldupdate !== 'skipWait') {
      await this.ready;
    }

    localStorage.setItem('NEWS', data.title);

    for (const item of data.contents) {
      ImgCache.cacheFile(item.icon);
    }

    await this.DB.populateTable(this.table, data.contents);
    return true;
  }

  getTitle() {
    return localStorage.getItem('NEWS');
  }
}
