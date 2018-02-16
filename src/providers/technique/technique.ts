import { Injectable } from '@angular/core';

import { BaseModel } from '../database/basemodel';
import { ApiProvider } from '../api/api';
import { DatabaseProvider } from '../database/database';
import { serverLocation } from '../api/serverLocation';
import { TableDef } from '../database/table';
import { ImgcacheService } from '../../imgcache/imgcache.service';
import { DBMethod } from '../database/decorators';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

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
}

@Injectable()
export class TechniqueProvider extends BaseModel<Technique> {
  protected readonly table: TableDef = {
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
  };

  constructor(
    protected API: ApiProvider,
    protected DB: DatabaseProvider,
    private imgcache: ImgcacheService,
    private sanitizer: DomSanitizer,
  ) {
    super();
    this.initialize();
  }

  protected transform(tech: Technique) {
    tech.icon = serverLocation + tech.icon;
    tech.images = [];
    for (const i of ['img1', 'img2', 'img3']) {
      let img = tech[i];
      if (img && img[img.length - 1] !== '/') {
        tech[i] = img = serverLocation + img;
        tech.images.push(img);
      }
    }
  }

  @DBMethod
  async getAll() {
    const techs = await super.getAll()
    for (const tech of techs) {
      tech.images = await this.getCachedImages(tech.images);
    }
    console.log(techs);
    return techs;
  }

  private getCachedImages(images: string[]): Promise<string[]> {
    return Promise.all(
      images.map(img => this.imgcache.getCachedFileURL(img)),
    ).then(imgs => imgs.map(img => this.sanitizer.bypassSecurityTrustUrl(img) as string));
  }

  @DBMethod
  async getOne(id) {
    const tech = await super.getOne(id);
    tech.images = await this.getCachedImages(tech.images);
    console.log(tech.images);
    return tech;
  }
}
