import { Component } from '@angular/core';
import { AdsProvider } from '../../providers/ads/ads';

@Component({
  selector: 'ads',
  templateUrl: 'ads.html',
})
export class AdsComponent {
  ads: any[];

  constructor(
    private adsProvider: AdsProvider,
  ) {
    this.adsProvider.getAdsForHome().subscribe(async (ads) => {
      this.ads = ads;
    });
  }

}
