import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Product } from '../../providers/product/product';
import { Area } from '../../providers/area/area';
import { serverLocation } from '../../providers/api/serverLocation';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-areas-detail-license',
  templateUrl: 'areas-detail-license.html',
})
export class AreasDetailLicensePage {
  area: Area;
  products: Product[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settings: SettingsProvider,
    private platform: Platform,
    private modalCtrl: ModalController,
  ) {
    this.navParams.get('params').subscribe(({ area, org, products }) => {
      this.area = area;
      this.products = products;
    });
  }

  buy(product: Product, method: {name: string}) {
    console.log('buy', product, method);

    if (method.name === 'Web') {
      // TODO: persist user to server
      const url = `${serverLocation}/mobile/index.php?lang=${this.settings.language}&p=5&i=${product.ID}&app=true&device=${this.getPlatform()}`;
      window.open(url, '_system');

      // TODO: analytics
      // analytics.trackEvent('Purchase', 'Web', id);
    } else if (method.name === 'SMS') {
      this.modalCtrl.create('SmsPurchasePage', {
        product,
      }).present();
    }
  }

  private getPlatform() {
    if (this.platform.is('ios')) {
      return 'ios';
    } else if (this.platform.is('android')) {
      return 'android';
    } else if (this.platform.is('windows')) {
      return 'windows';
    }
    return 'unknown';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AreasDetailLicensePage');
  }

}
