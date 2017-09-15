import { Injectable } from '@angular/core';
import * as ImgCache from 'imgcache.js';
import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class InformationProvider extends BaseModel {
  protected readonly table = {
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

  update(shouldupdate) {
    // Always update
    return this.API.get_content_menu()
      .then(data => {
        if (shouldupdate === 'skipWait')
          return data;
        return this.wait.then(() => {
          return data;
        });
      })
      .then(data => {
        localStorage.setItem('NEWS', data.title);
        for (const item of data.contents) {
          ImgCache.cacheFile(item.icon);
        }
        return this.DB.populateTable(this.table, data.contents);
      })
      .then(() => {
        return 'News';
      }, err => {
        console.warn(err);
        return Promise.reject(err);
      });
  }

  getTitle() {
    return localStorage.getItem('NEWS');
  }
}
