import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { SettingsProvider } from '../../providers/settings/settings';
import { PlatformProvider } from '../../providers/platform/platform';
import { serverLocation } from '../../providers/api/serverLocation';
import { Product, ProductProvider } from '../../providers/product/product';
import { filter } from 'rxjs/operators';

/**
 * Generated class for the PurchasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'purchase/:ID',
  defaultHistory: ['HomePage', 'AreasPage', 'AreasSearchPage', 'AreasDetailPage'],
})
@Component({
  selector: 'page-purchase',
  templateUrl: 'purchase.html',
})
export class PurchasePage implements AfterViewInit {
  @ViewChild('frame') frame: ElementRef;
  frameSource: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  product: Product;
  loaded: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private settings: SettingsProvider,
    private platform: PlatformProvider,
    private ga: GoogleAnalytics,
    private productProvider: ProductProvider,
  ) {}

  async ionViewWillEnter() {
    this.product = this.navParams.data;
    const ID = this.navParams.get('ID');
    if (!this.product || this.product.t == undefined) {
      if (!ID) {
        this.navCtrl.pop();
        return;
      }
      try {
        this.product = await this.productProvider.getOne(ID);
      } catch (err) {
        console.error(err);
      }
    }

    this.ga.trackEvent('Purchase', 'Web', ID);

    // TODO: pass user session to server
    const params = new HttpParams({
      fromObject: {
        lang: this.settings.language,
        p: '5',
        i: ID,
        app: 'true',
        device: this.platform.platform,
      },
    });

    const url = `${serverLocation}/mobile/index.php?${params.toString()}`;

    this.frameSource = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngAfterViewInit() {
    fromEvent(this.frame.nativeElement, 'load')
      .pipe(filter(ev => ev.target && ev.target.src !== 'about:blank'))
      .subscribe(event => {
        this.loaded = true;
      });
  }
}
