import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Product } from '../../providers/product/product';
import { Area } from '../../providers/area/area';
import { Permit } from '../../providers/user/userTypes';
import { MonitoringClient } from '../../app/monitoring';
import { DeepLinks, DeepLinksProvider } from '../../providers/deep-links/deep-links';
import { GoogleAnalytics } from '../../providers/google-analytics/google-analytics';

@IonicPage()
@Component({
  selector: 'page-areas-detail-permit',
  templateUrl: 'areas-detail-permit.html',
})
export class AreasDetailPermitPage {
  area: Area;
  products: Product[];
  rootNavCtrl: NavController;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private ga: GoogleAnalytics,
    private deepLinks: DeepLinksProvider,
  ) {
    const params: Observable<any> =
      this.navParams.get('params') || ((this.navCtrl as any).rootParams && (this.navCtrl as any).rootParams.params);

    params.subscribe(({ area, org, products, rootNavCtrl }) => {
      this.area = area;
      this.products = products;
      this.rootNavCtrl = rootNavCtrl;
    });
  }

  buy(product: Product, method: { name: string }) {
    console.log('buy', product, method);

    if (method.name === 'Web') {
      this.rootNavCtrl.push('PurchasePage', { ...product });
    } else if (method.name === 'SMS') {
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
