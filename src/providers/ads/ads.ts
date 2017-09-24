import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ApiProvider } from '../api/api';

/*
  Generated class for the AdsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdsProvider {

  constructor(public API: ApiProvider) {
  }

  getAdsForHome() {
    return this.API.get_ads_main().then(ads => {
      return ads.filter(ad => {
        const start = new Date(ad.start).getTime();
        const end = new Date(ad.end).getTime();
        const now = new Date().getTime();
        return start < now && now < end;
      });
    });
  }
}
