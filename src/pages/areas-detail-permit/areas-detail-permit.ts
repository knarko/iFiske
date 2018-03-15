import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Product } from '../../providers/product/product';
import { Area } from '../../providers/area/area';
import { serverLocation } from '../../providers/api/serverLocation';
import { SettingsProvider } from '../../providers/settings/settings';
import { PlatformProvider } from '../../providers/platform/platform';
import { Permit } from '../../providers/user/user';
import { MonitoringClient } from '../../app/monitoring';

@IonicPage()
@Component({
  selector: 'page-areas-detail-permit',
  templateUrl: 'areas-detail-permit.html',
})
export class AreasDetailPermitPage {
  area: Area;
  products: Product[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settings: SettingsProvider,
    private platform: PlatformProvider,
    private modalCtrl: ModalController,
  ) {
    this.navParams.get('params').subscribe(({ area, org, products }) => {
      this.area = area;
      this.products = products;
    });
  }

  buy(product: Product, method: { name: string }) {
    console.log('buy', product, method);

    if (method.name === 'Web') {
      // TODO: pass user session to server
      const url = `${serverLocation}/mobile/index.php?lang=${this.settings.language}&p=5&i=${product.ID}&app=true&device=${this.platform.platform}`;
      window.open(url, '_system');

      // TODO: analytics
      // analytics.trackEvent('Purchase', 'Web', id);
    } else if (method.name === 'SMS') {
      this.modalCtrl.create('SmsPurchasePage', {
        product,
      }).present();
    } else {
      MonitoringClient.captureException(new Error(`There was no valid method: ${method} for product ${product.ID}
        ${JSON.stringify(product.methods)}
      `));
    }
  }

  openRules(permit: Permit) {
    this.modalCtrl.create('PermitRulesPage', {
      t: permit.rule_t,
      d: permit.rule_d,
      ver: permit.rule_ver,
    }).present();
  }
}
