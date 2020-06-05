import { Injectable } from '@angular/core';

import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { TableDef } from '../database/table';
import { ImgcacheService } from '../../imgcache/imgcache.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RegionProvider } from '../region/region';

export interface Technique {
  ID: number;
  t: string;
  d: string;
  so: number;
  de: string;
  da: string;
  icon: string;
  img1: string;
  img2: string;
  img3: string;
  youtube: string;

  images: string[];
  cachedImages: Promise<string[]>;
}

@Injectable()
export class TechniqueProvider extends BaseModel<Technique> {
  protected readonly tables: TableDef[] = [
    {
      name: 'Technique',
      apiMethod: 'get_techniques',
      primary: 'ID',
      members: {
        ID: 'int',
        t: 'text',
        d: 'text',
        so: 'int',
        de: 'text',
        da: 'text',
        icon: 'text',
        img1: 'text',
        img2: 'text',
        img3: 'text',
        youtube: 'text',
      },
    },
  ];

  constructor(
    protected API: ApiProvider,
    protected DB: DatabaseProvider,
    private imgcache: ImgcacheService,
    private sanitizer: DomSanitizer,
    private region: RegionProvider,
  ) {
    super();
    this.initialize();
    this.ready.then(() => {
      this.getAll();
    });
  }

  protected transform(tech: Technique) {
    tech.icon = this.region.serverLocation$.value + tech.icon;
    tech.images = [];
    for (const i of ['img1', 'img2', 'img3']) {
      let img = tech[i];
      if (img && img[img.length - 1] !== '/') {
        tech[i] = img = this.region.serverLocation$.value + img;
        tech.images.push(img);
      }
    }
    tech.cachedImages = this.getCachedImages(tech.images);
  }

  private getCachedImages(images: string[]): Promise<string[]> {
    return Promise.all(
      images.map((img) => this.imgcache.getCachedFile(img)),
    ).then((imgs) =>
      imgs.map((img) => this.sanitizer.bypassSecurityTrustUrl(img) as string),
    );
  }
}
