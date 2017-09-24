import { Injectable } from '@angular/core';

import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { serverLocation } from '../api/serverLocation';
import { TableDef } from '../database/table';

@Injectable()
export class TechniqueProvider extends BaseModel {
  protected readonly table: TableDef = {
      name:      'Technique',
      apiMethod: 'get_techniques',
      primary:   'ID',
      members:   {
        ID:      'int',
        t:       'text',
        d:       'text',
        so:      'int',
        de:      'text',
        da:      'text',
        icon:    'text',
        img1:    'text',
        img2:    'text',
        img3:    'text',
        youtube: 'text',
      },
    };

    constructor(
      protected API: ApiProvider,
      protected DB: DatabaseProvider,
    ) {
      super();
      this.initialize();
    }

    protected transform(tech) {
      tech.icon = serverLocation + tech.icon;
      tech.img1 = serverLocation + tech.img1;
      tech.img2 = serverLocation + tech.img2;
      tech.img3 = serverLocation + tech.img3;
      tech.images = [tech.img1, tech.img2, tech.img3];
    }
}
