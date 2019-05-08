import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Product } from '../../providers/product/product';
import { Area } from '../../providers/area/area';
import { Permit } from '../../providers/user/userTypes';
import { MonitoringClient } from '../../app/monitoring';
import { DeepLinks, DeepLinksProvider } from '../../providers/deep-links/deep-links';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@IonicPage()
@Component({
  selector: 'page-areas-detail-permit',
  templateUrl: 'areas-detail-permit.html',
})
export class AreasDetailPermitPage {
  area: Area;
  products: Product[];

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private deepLinks: DeepLinksProvider,
    private analytics: FirebaseAnalytics,
  ) {
    const params: Observable<any> =
      this.navParams.get('params') || ((this.navCtrl as any).rootParams && (this.navCtrl as any).rootParams.params);

    params.subscribe(({ area, org, products }) => {
      this.area = area;
      this.products = products;
    });
  }

  ionViewDidEnter() {
    if (this.area) {
      this.analytics.logEvent('view_item_list', { item_category: this.area.ID });
    }
  }

  buy(product: Product, method: { name: string }) {
    console.log('buy', product, method);
    this.analytics.logEvent('begin_checkout', { value: product.price, currency: 'SEK', method, item_id: product.ID });

    if (method.name === 'Web') {
      this.deepLinks.open(DeepLinks.buy, { productId: '' + product.ID }, { bringSession: true });
    } else if (method.name === 'SMS') {
      this.analytics.logEvent('open_sms_purchase', { item_id: product.ID });
      this.modalCtrl
        .create('SmsPurchasePage', {
          product,
        })
        .present();
    } else {
      MonitoringClient.captureException(
        new Error(`There was no valid method: ${method} for product ${product.ID}
        ${JSON.stringify(product.methods)}
      `),
      );
    }
  }

  openRules(permit: Permit) {
    this.modalCtrl
      .create('PermitRulesPage', {
        t: permit.rule_t,
        d: permit.rule_d,
        ver: permit.rule_ver,
      })
      .present();
  }
}
