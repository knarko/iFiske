import { Injectable } from '@angular/core';
import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { TableDef } from '../database/table';
import { ImgcacheService } from '../../imgcache/imgcache.service';

export interface InformationArticle {
  ID: number;
  t: string;
  text: string;
  img: string;
  icon: string;
}

@Injectable()
export class InformationProvider extends BaseModel<InformationArticle> {
  protected readonly tables: TableDef[] = [
    {
      name: 'Information',
      primary: 'ID',
      members: {
        ID: 'int',
        t: 'text',
        text: 'text',
        img: 'text',
        icon: 'text',
      },
    },
  ];

  readonly updateStrategy = 'always';

  constructor(protected API: ApiProvider, protected DB: DatabaseProvider, private imgcache: ImgcacheService) {
    super();
    this.initialize();
  }

  async update(skipWait?: boolean): Promise<boolean> {
    if (!skipWait) {
      await this.ready;
    }

    const data = await this.API.get_content_menu();

    localStorage.setItem('NEWS', data.title);

    for (const item of data.contents) {
      this.imgcache.cacheFile(item.icon).catch(() => {});
    }

    await this.DB.populateTable(this.tables[0], data.contents);
    return true;
  }

  getTitle() {
    return localStorage.getItem('NEWS');
  }
}
