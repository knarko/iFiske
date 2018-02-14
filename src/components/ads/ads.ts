import { Component } from '@angular/core';
import { AdsProvider } from '../../providers/ads/ads';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ads',
  templateUrl: 'ads.html',
})
export class AdsComponent {
  ads: Observable<any[]>;

  constructor(private adsProvider: AdsProvider) {
    this.ads = this.adsProvider.getAdsForHome();
  }

}
