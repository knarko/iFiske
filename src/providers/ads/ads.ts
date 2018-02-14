import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class AdsProvider {

  constructor(public API: ApiProvider) {
  }

  getAdsForHome(): Observable<any[]> {
    return this.API.getAdsMain().pipe(map(ads => {
      return ads.filter(ad => {
        const start = new Date(ad.start).getTime();
        const end = new Date(ad.end).getTime();
        const now = new Date().getTime();
        return start < now && now < end;
      });
    }));
  }
}
