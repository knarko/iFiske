import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ImgcacheService } from '../../imgcache/imgcache.service';

interface Ad {
  start: number;
  end: number;
  app_imageurl: string;
}

@Injectable()
export class AdsProvider {
  constructor(public API: ApiProvider, private imgcache: ImgcacheService, private sanitizer: DomSanitizer) {}

  getAdsForHome(): Observable<any[]> {
    return this.API.getAdsMain().pipe(
      map((ads: Ad[]) => {
        return ads.filter(ad => {
          const start = new Date(ad.start).getTime();
          const end = new Date(ad.end).getTime();
          const now = new Date().getTime();
          return start < now && now < end;
        });
      }),
      switchMap(ads => {
        return Promise.all(
          ads.map(async ad => {
            const img = await this.imgcache.getCachedFile(ad.app_imageurl);
            ad.app_imageurl = this.sanitizer.bypassSecurityTrustUrl(img) as string;
            return ad;
          }),
        );
      }),
      catchError(() => of([])),
    );
  }
}
